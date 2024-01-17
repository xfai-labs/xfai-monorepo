import pytest
from brownie import XfaiLibrary, MockERC20, MockWETH, XfaiV0Core, XfaiFactory,XfaiINFT, XfaiV0Periphery03, accounts, interface, chain
import brownie
from xfaipy.pool import Pool
from xfaipy.pool_pair import PoolPair
from datetime import datetime, timedelta
from fractions import Fraction


CHAIN_ID = 5777 # Ganache. Not used in tests
slippage_tolerance = 5 # 0.5%
min_liquidity = 10**3
delta = timedelta(minutes=20)
swapFee = 40

@pytest.fixture(scope="function")
def token1():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def token2():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def fake_token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def xfit():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)
    return factory

@pytest.fixture(scope="function")
def xfai_core(xfai_factory, mock_weth):
    accounts[0].deploy(XfaiLibrary)
    core = accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth, 20, 20)
    xfai_factory.setXfaiCore(core.address, {'from': accounts[1]})
    return core

@pytest.fixture(scope="function")
def xfai_periphery(xfai_factory, xfai_core, mock_weth, token1):
    periphery = accounts[0].deploy(XfaiV0Periphery03, xfai_factory.address, mock_weth.address)

    owner = accounts[1]
    pool1_reserve, eth_amount = 1e19, 1e18
    token1.approve(periphery, pool1_reserve * 10, {'from': owner})

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

    eth_amount = 1e19
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    return periphery, mock_weth, token1

def test_removeLiquidity_token_weth(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, weth, token1 = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity = interface.IERC20(pool1_address).balanceOf(owner)
    total_supply = interface.IERC20(pool1_address).totalSupply()
    output_amount_token, output_amount_weth = pool1.get_liquidity_value(liquidity, total_supply)
    token_amount_min = output_amount_token - int(Fraction(output_amount_token) * slippage_tolerance / 1000)
    weth_amount_min = output_amount_weth - int(Fraction(output_amount_weth) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    interface.IERC20(pool1_address).approve(periphery.address, liquidity, {'from': owner})
    tx = periphery.removeLiquidity(
        owner,
        token1.address,
        weth.address,
        liquidity,
        token_amount_min,
        weth_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Burn"]
    assert tx_event['amount0'] == output_amount_token
    assert tx_event['amount1'] == output_amount_weth


def test_removeLiquidity_token_ETH(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, token1 = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity = interface.IERC20(pool1_address).balanceOf(owner)
    total_supply = interface.IERC20(pool1_address).totalSupply()
    output_amount_token, output_amount_weth = pool1.get_liquidity_value(liquidity, total_supply)
    token_amount_min = output_amount_token - int(Fraction(output_amount_token) * slippage_tolerance / 1000)
    weth_amount_min = output_amount_weth - int(Fraction(output_amount_weth) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    balance = accounts[5].balance()
    interface.IERC20(pool1_address).approve(periphery.address, liquidity, {'from': owner})
    tx = periphery.removeLiquidity(
        accounts[5],
        token1.address,
        mock_weth.address,
        liquidity,
        token_amount_min,
        weth_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Burn"]
    assert tx_event['amount0'] == output_amount_token
    assert tx_event['amount1'] == output_amount_weth
    assert accounts[5].balance() == balance + output_amount_weth