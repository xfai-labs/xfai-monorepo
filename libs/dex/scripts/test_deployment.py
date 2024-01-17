from brownie import MockERC20, MockUSDERC20, MockWETH, MockWBTCERC20, Multicall3, XfaiLibrary, XFETH, InfinityNFTPeriphery, XfaiV0Periphery01, XfaiINFT, XfaiV0Core, XfaiFactory, accounts, chain, interface
from datetime import datetime, timedelta
from fractions import Fraction
import json
#from brownie import network
import sys

lp_fee = 10  # 0.1%
inft_fee = 10  # 0.1%
xfETH_fee = 10 # 0.1%
total_fee = lp_fee + inft_fee
slippage_tolerance = 5  # 0.5%
delta = timedelta(minutes=20)  # required for function deadlines
fake_private_keys = ['e58f089539618900d54293abc81872cc4ef6ca68b907fe6c389f6b4af709a1e7', '50279c6d7ab0cce52ff10fddaef3d8403f62b7e4e93d4bc7fb57f61e66ab13de'
                     ]
local_account = accounts.add(fake_private_keys[0])
other_local_account = accounts.add(fake_private_keys[1])
baseURI = 'some_link/'
goerli_weth = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'  # goerli weth address

def main(wait=False):
    if sys.argv[-1] == 'goerli':
        weth_address = goerli_weth
    else:
        weth = local_account.deploy(MockWETH)
        weth_address = weth.address 
        accounts[1].transfer(local_account, accounts[1].balance())
    multicall = Multicall3.deploy({"from": local_account})
    # deploy tokens
    token1 = local_account.deploy(MockERC20, local_account, 1e28)
    token2 = local_account.deploy(MockERC20, local_account, 1e28)
    token3 = local_account.deploy(MockERC20, local_account, 1e28)
    token4 = local_account.deploy(MockERC20, local_account, 1e28)
    stable1 = MockUSDERC20.deploy(local_account, 1e28, {"from": local_account})
    stable2 = MockUSDERC20.deploy(local_account, 1e28, {"from": local_account})
    stable3 = MockUSDERC20.deploy(local_account, 1e28, {"from": local_account})
    wbtc = MockWBTCERC20.deploy(local_account, 1e28, {"from": local_account})
    xfit = local_account.deploy(MockERC20, local_account, 1e28)
    xfETH_token = XFETH.deploy(local_account, xfETH_fee, {'from': local_account, 'value': 1})

    local_account.deploy(XfaiLibrary)
    xfai_factory = local_account.deploy(XfaiFactory, local_account, xfETH_token)
    inft =  local_account.deploy(XfaiINFT, xfai_factory, weth_address, xfit, 1e19, 2)
    inft.premint(
        [local_account, local_account], 
        [5e17, 5e17], {'from': local_account}
    )
    core = local_account.deploy(XfaiV0Core, xfai_factory, inft, xfETH_token, lp_fee, inft_fee)
    xfai_factory.setXfaiCore(core, {'from': local_account})
    periphery = local_account.deploy(XfaiV0Periphery01, xfai_factory, weth_address, xfETH_token)
    infinity_periphery = local_account.deploy(InfinityNFTPeriphery, xfai_factory, xfai_factory, xfETH_token, inft, xfit, weth_address)

    pool_reserve, eth_amount = 1e19, 1e17
    stables = [stable1, stable2, stable3,]
    tokens = [token1, token2, token3, token4, wbtc, xfit]
    for token in tokens + stables:
        token.approve(periphery, pool_reserve, {'from': local_account})

    for token in tokens:
        deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
        periphery.addLiquidity(
            local_account,
            token.address,
            pool_reserve,
            pool_reserve,
            xfETH_token.ETHToXfETH(eth_amount),
            deadline,
            {"from": local_account, "value": eth_amount}
        )

    for token in stables:
        deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
        periphery.addLiquidity(
            local_account,
            token.address,
            1700 * 10**6 * eth_amount / 10**18,
            1700 * 10**6 * eth_amount / 10**18 - 10**7,
            xfETH_token.ETHToXfETH(eth_amount),
            deadline,
            {"from": local_account, "value": eth_amount}
        )

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    periphery.addLiquidityETH(
        local_account,
        deadline,
        {"from": local_account, "value": eth_amount * 2}
    )

    print("Deployed Contracts")
    print(json.dumps({
        "compound": token1.address,
        "aave": token2.address,
        "matic": token3.address,
        "link": token4.address,
        "token_usd": stable1.address,
        "token_dai": stable2.address,
        "token_usdt": stable3.address,
        "wbtc": wbtc.address,
        "xfit": xfit.address,
        "xfeth": xfETH_token.address,
        "weth": weth_address,
        "inft": inft.address,
        "factory": xfai_factory.address,
        "core": core.address,
        "periphery": periphery.address,
        "inft_periphery": infinity_periphery.address,
        "multicall": multicall.address,
        "pool_hash": str(xfai_factory.poolCodeHash())
    },
        indent=4
    ))

    if wait:
        print('Import this privatekey to your metamask: %s' %
              fake_private_keys[0])
        input('Press any key to exit...')
        print('Import this privatekey to your metamask: %s' %
              fake_private_keys[1])
        input('Press any key to exit...')



