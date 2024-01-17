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
def xfai_periphery(mock_weth, xfai_core, xfai_factory):
    return accounts[0].deploy(XfaiV0Periphery03, xfai_factory.address, mock_weth.address)


def test_addLiquidity(xfai_factory, xfai_periphery, token1):
    owner = accounts[1]
    pool1_reserve, eth_amount = 1e18, 1e14
    token1.approve(xfai_periphery, pool1_reserve, {'from': owner})

    pool1 = Pool(CHAIN_ID, token1.address, 0, 0, swapFee)

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    pool1_amount_min = pool1_reserve

    # add liquidity to empty pool
    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(pool1_reserve, eth_amount, 0)

    # add liquidity a second time
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    assert r1 == pool1_reserve
    assert w1 == eth_amount

    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    token_amount = pool1_reserve
    xfeth_amount = pool1.quote(token_amount, w1, r1)
    #eth_amount = xfETH_token.xfETHToETH(xfeth_amount)
    assert eth_amount == int(1e14)
    pool1_amount_min = token_amount - int(Fraction(token_amount) * slippage_tolerance / 1000)
    pool1_ETH_min = eth_amount - int(Fraction(eth_amount) * slippage_tolerance / 1000)

    total_supply = interface.IERC20(pool1_address).totalSupply()
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    token1.approve(xfai_periphery, token_amount, {'from': owner})

    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        token_amount,
        pool1_amount_min,
        pool1_ETH_min,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(token_amount, xfeth_amount, total_supply)
 

def test_addLiquidity_min1(xfai_factory, xfai_core, xfai_periphery, token1):
    owner = accounts[1]
    pool1_reserve, eth_amount = 1e18, 1e14
    token1.approve(xfai_periphery, pool1_reserve, {'from': owner})

    pool1 = Pool(CHAIN_ID, token1.address, 0, 0, swapFee)

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    pool1_amount_min = pool1_reserve

    # add liquidity to empty pool
    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(pool1_reserve, eth_amount, 0)

    # add liquidity a second time
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    assert r1 == pool1_reserve
    assert w1 == eth_amount

    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    token_amount = pool1_reserve
    xfeth_amount = pool1.quote(token_amount, w1, r1)
    assert eth_amount == int(1e14)
    pool1_amount_min = token_amount - int(Fraction(token_amount) * slippage_tolerance / 1000)
    pool1_ETH_min = eth_amount - int(Fraction(eth_amount) * slippage_tolerance / 1000)

    total_supply = interface.IERC20(pool1_address).totalSupply()
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    token1.approve(xfai_periphery, token_amount, {'from': owner})

    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        token_amount,
        pool1_amount_min,
        pool1_ETH_min,
        deadline,
        {"from": owner, "value": eth_amount - 10}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(token_amount, pool1.quote(token_amount, w1, r1), total_supply) - 1000

def test_addLiquidity_min2(xfai_factory, xfai_core, xfai_periphery, token1):
    owner = accounts[1]
    pool1_reserve, eth_amount = 1e18, 1e14
    token1.approve(xfai_periphery, pool1_reserve, {'from': owner})

    pool1 = Pool(CHAIN_ID, token1.address, 0, 0, swapFee)

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    pool1_amount_min = pool1_reserve

    # add liquidity to empty pool
    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(pool1_reserve, eth_amount, 0)

    # add liquidity a second time
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    assert r1 == pool1_reserve
    assert w1 == eth_amount

    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    token_amount = pool1_reserve
    xfeth_amount = pool1.quote(token_amount, w1, r1)
    assert eth_amount == int(1e14)
    pool1_amount_min = token_amount - int(Fraction(token_amount) * slippage_tolerance / 1000)
    pool1_ETH_min = eth_amount - int(Fraction(eth_amount) * slippage_tolerance / 1000)

    total_supply = interface.IERC20(pool1_address).totalSupply()
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    token1.approve(xfai_periphery, token_amount, {'from': owner})

    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        token_amount - 10,
        pool1_amount_min,
        pool1_ETH_min,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(token_amount, pool1.quote(eth_amount, r1, w1), total_supply)


def test_addLiquidity_reverts(xfai_factory, xfai_core, xfai_periphery, token1):
    owner = accounts[1]
    pool1_reserve, eth_amount = 1e18, 1e14
    token1.approve(xfai_periphery, pool1_reserve, {'from': owner})

    pool1 = Pool(CHAIN_ID, token1.address, 0, 0, swapFee)

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    pool1_amount_min = pool1_reserve

    # add liquidity to empty pool
    tx = xfai_periphery.addLiquidity(
        owner,
        token1.address,
        pool1_reserve,
        pool1_amount_min,
        eth_amount,
        deadline,
        {"from": owner, "value": eth_amount}
    )
    tx_event = tx.events["Mint"]
    assert tx_event["liquidity"] == pool1.get_liquidity_minted(pool1_reserve, eth_amount, 0)

    # add liquidity a second time
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    assert r1 == pool1_reserve
    assert w1 == eth_amount

    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    token_amount = pool1_reserve
    xfeth_amount = pool1.quote(token_amount, w1, r1)
    assert eth_amount == int(1e14)
    pool1_amount_min = token_amount - int(Fraction(token_amount) * slippage_tolerance / 1000)
    pool1_ETH_min = eth_amount - int(Fraction(eth_amount) * slippage_tolerance / 1000)

    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    token1.approve(xfai_periphery, token_amount, {'from': owner})

    error_message1 = 'XfaiV0Periphery03: INSUFFICIENT_1_AMOUNT'
    error_message2 = 'XfaiV0Periphery03: INSUFFICIENT_0_AMOUNT'
    with brownie.reverts(error_message1):
        xfai_periphery.addLiquidity(
            owner,
            token1.address,
            token_amount / 2,
            pool1_amount_min,
            pool1_ETH_min,
            deadline,
            {"from": owner, "value": eth_amount}
        )
    with brownie.reverts(error_message2):
        xfai_periphery.addLiquidity(
            owner,
            token1.address,
            token_amount,
            pool1_amount_min,
            pool1_ETH_min,
            deadline,
            {"from": owner, "value": eth_amount/2}
        )
    