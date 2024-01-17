from brownie import XfaiLibrary, InfinityNFTPeriphery, XfaiV0Periphery02, XfaiV0Core, accounts
import json

lp_fee = 10  # 0.1%
inft_fee = 10  # 0.1%
xfETH_fee = 20 # 0.2%

local_account = accounts.load('xfai_mainnet')

weth_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
xfit_address = "0x4aa41bc1649c9c3177ed16caaa11482295fc7441"

inft_address = "0xe5840e8a0Ff758D4F9a356F5A2F3914202A81e6f"
factory = "0x0b51D00eF3Df0B66766938220542185F6fDbC0B7"
xfETH = "0xa449845c3309ac5269DFA6b2F80eb6E73D0AE021"

def main(wait=False):
    local_account.deploy(XfaiLibrary, publish_source=True)
    #xfETH_token = XFETH.deploy(local_account, xfETH_fee, {'from': local_account, 'value': 1}, publish_source=True)
    #xfai_factory = local_account.deploy(XfaiFactory, local_account, xfETH_token, publish_source=True)
    
    core = local_account.deploy(XfaiV0Core, factory, inft_address, xfETH, lp_fee, inft_fee, publish_source=True)
    #xfai_factory.setXfaiCore(core, {'from': local_account})
    periphery = local_account.deploy(XfaiV0Periphery02, factory, weth_address, xfETH, publish_source=True)
    infinity_periphery = local_account.deploy(InfinityNFTPeriphery, factory, factory, xfETH, inft_address, xfit_address, weth_address, publish_source=True)

    print("Deployed Contracts")
    print(json.dumps({
        "core": core.address,
        "periphery": periphery.address,
        "inft_periphery": infinity_periphery.address
    },
        indent=4
    ))



