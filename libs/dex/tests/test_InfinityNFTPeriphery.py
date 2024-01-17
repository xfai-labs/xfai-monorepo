import pytest
from brownie import XfaiLibrary, MockERC20, MockWETH, XfaiV0Core, XfaiFactory, XfaiINFT, XfaiV0Periphery03, InfinityNFTPeriphery, accounts, interface, chain
import brownie
from xfaipy.pool import Pool
from xfaipy.inft import INFT
from xfaipy.pool_pair import PoolPair
from datetime import datetime, timedelta
from fractions import Fraction


CHAIN_ID = 5777 # Ganache. Not used in tests
slippage_tolerance = 5 # 0.5%
min_liquidity = 10**3
delta = timedelta(minutes=20)
swapFee = 40


@pytest.fixture(scope="module")
def deployments():
    token1 = accounts[0].deploy(MockERC20, accounts[1], 1e28)
    token2 = accounts[0].deploy(MockERC20, accounts[1], 1e28)
    # fake token
    fake_token = accounts[0].deploy(MockERC20, accounts[1], 1e28)
    # weth
    mock_weth = accounts[0].deploy(MockWETH)
    # xfit
    underlying_token = accounts[0].deploy(MockERC20, accounts[1], 1e28)
    # factory
    xfai_factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)

    # "old" factory
    old_xfai_factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)

    # inft
    inft =  accounts[0].deploy(
        XfaiINFT, 
        old_xfai_factory, 
        mock_weth,
        underlying_token,
        1e19,
        2
    )
    inft.premint(
        [accounts[0], accounts[1]], 
        [5e17, 5e17], {'from': accounts[1]}
    )
    # library
    accounts[0].deploy(XfaiLibrary)
    # core
    core = accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth, 20, 20)
    xfai_factory.setXfaiCore(core.address, {'from': accounts[1]})
    # periphery
    periphery = accounts[0].deploy(XfaiV0Periphery03, xfai_factory.address, mock_weth.address)
    # inft periphery
    infinity_periphery = accounts[0].deploy(InfinityNFTPeriphery, xfai_factory.address, old_xfai_factory.address, inft.address, underlying_token.address, mock_weth.address)

    owner = accounts[1]
    pool1_reserve, eth_amount = 1e19, 1e18
    token1.approve(periphery, 1e24, {'from': owner})
    token2.approve(periphery, 1e24, {'from': owner})
    mock_weth.approve(periphery, 1e24, {'from': owner})
    underlying_token.approve(periphery, 1e24, {'from': owner})
    token1.approve(infinity_periphery, 1e24, {'from': owner})
    token2.approve(infinity_periphery, 1e24, {'from': owner})
    mock_weth.approve(infinity_periphery, 1e24, {'from': owner})
    underlying_token.approve(infinity_periphery, 1e24, {'from': owner})

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    pool1_amount_min = pool1_reserve

    # add liquidity to empty pool
    periphery.addLiquidity(
        owner,
        token1.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )

    # add liquidity to empty pool
    periphery.addLiquidity(
        owner,
        token2.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )

    # add liquidity to empty pool
    periphery.addLiquidity(
        owner,
        underlying_token.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )

    eth_amount = 1e19
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

   
    return infinity_periphery, periphery, core, xfai_factory, inft, underlying_token, mock_weth, token2, token1

def test_permanentStaking_xfit(deployments):
    owner = accounts[1]
    infinity_periphery, periphery, core, xfai_factory, infinity_nft, underlying_token, mock_weth, token2, token1 = deployments    
    pool1_address = xfai_factory.getPool(underlying_token.address)
    pool2_address = xfai_factory.getPool(token2.address)

    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, underlying_token.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool1, pool2)
    amount_underlying_in = 1e10
    amount_underlying_in_min = amount_underlying_in - int(Fraction(amount_underlying_in) * slippage_tolerance / 1000)
    initial_reserve, reserve, shares = infinity_nft.getStates()
    inft = INFT(CHAIN_ID, pool_pair, underlying_token.address, initial_reserve, reserve, shares)
    inft_share_min = inft.get_share(amount_underlying_in_min)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    
    tx = infinity_periphery.permanentStaking(
        owner,
        amount_underlying_in,
        inft_share_min,
        deadline,
        {'from': owner}
    )
    tx_event = tx.events["Mint"]
    assert tx_event['share'] > inft_share_min


def test_permanentBoosting_xfit(deployments):
    owner = accounts[1]
    infinity_periphery, periphery, core, xfai_factory, infinity_nft, underlying_token, mock_weth, token2, token1 = deployments    
    pool1_address = xfai_factory.getPool(underlying_token.address)
    pool2_address = xfai_factory.getPool(token2.address)

    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, underlying_token.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool1, pool2)
    amount_underlying_in = 1e10
    amount_underlying_in_min = amount_underlying_in - int(Fraction(amount_underlying_in) * slippage_tolerance / 1000)
    initial_reserve, reserve, shares = infinity_nft.getStates()
    inft = INFT(CHAIN_ID, pool_pair, underlying_token.address, initial_reserve, reserve, shares)
    inft_share_min = inft.get_share(amount_underlying_in_min)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    
    tx = infinity_periphery.permanentBoosting(
        amount_underlying_in,
        inft_share_min,
        2,
        deadline,
        {'from': owner}
    )
    tx_event = tx.events["Boost"]
    assert tx_event['share'] > inft_share_min


