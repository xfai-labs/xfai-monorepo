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

@pytest.fixture(scope="module")
def token1():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def token2():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def fake_token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="module")
def xfit():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)


@pytest.fixture(scope="module")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)
    return factory

@pytest.fixture(scope="module")
def xfai_core(xfai_factory, mock_weth):
    accounts[0].deploy(XfaiLibrary)
    core = accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth, 20, 20)
    xfai_factory.setXfaiCore(core.address, {'from': accounts[1]})
    return core

@pytest.fixture(scope="module")
def xfai_periphery(xfai_factory, xfai_core, mock_weth, token1, token2):
    periphery = accounts[0].deploy(XfaiV0Periphery03, xfai_factory.address, mock_weth.address)

    owner = accounts[1]
    pool1_reserve, eth_amount = 1e19, 1e18
    token1.approve(periphery, 1e24, {'from': owner})
    token2.approve(periphery, 1e24, {'from': owner})
    mock_weth.approve(periphery, 1e24, {'from': owner})
    mock_weth.deposit({"from": owner, "value": 5e18})

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

    eth_amount = 1e19
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    return periphery, mock_weth, token1, token2


#### test_swapExactTokensForTokens permutations

def test_swapExactTokensForTokens(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, _, token1, token2 = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    pool2_address = xfai_factory.getPool(token2.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool2, pool1)
    optimal_pool1_amount = pool_pair.get_output_amount(pool2_amount)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapExactTokensForTokens(
        owner,
        token2.address,
        token1.address,
        pool2_amount,
        pool1_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == pool2_amount
    assert tx_event["output"] == optimal_pool1_amount

def test_swapExactTokensForTokens_wethIn(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, token1, _ = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    optimal_pool1_amount = pool1.get_output_amount(pool2_amount, is_input_weth = True)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    tx = periphery.swapExactTokensForTokens(
        owner,
        mock_weth.address,
        token1.address,
        pool2_amount,
        pool1_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == pool2_amount
    assert tx_event["output"] == optimal_pool1_amount

def test_swapExactTokensForTokens_wethOut(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, token1, _ = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    optimal_pool1_amount = pool1.get_output_amount(pool2_amount)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    tx = periphery.swapExactTokensForTokens(
        owner,
        token1.address,
        mock_weth.address,
        pool2_amount,
        pool1_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == pool2_amount
    assert tx_event["output"] == optimal_pool1_amount

def test_swapExactTokensForTokens_revert(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, _, token1, token2 = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    pool2_address = xfai_factory.getPool(token2.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool2, pool1)
    optimal_pool1_amount = pool_pair.get_output_amount(pool2_amount)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())

    error_message = 'XfaiV0Periphery03: INSUFFICIENT_OUTPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapExactTokensForTokens(
            owner,
            token2.address,
            token1.address,
            pool2_amount,
            optimal_pool1_amount + 1e18,
            deadline,
            {"from": owner}
        )


#### test_swapTokensForExactTokens permutations

def test_swapTokensForExactTokens(xfai_factory, xfai_periphery,):
    owner = accounts[1]
    periphery, _, token1, token2 = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    pool2_address = xfai_factory.getPool(token2.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool2, pool1)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool_pair.get_input_amount(pool1_amount_out)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapTokensForExactTokens(
        owner,
        token2.address,
        token1.address,
        pool1_amount_out,
        pool2_amount_in_max,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert abs(tx_event["input"] - optimal_pool2_amount) <= 10
    assert tx_event["output"] == pool1_amount_out


def test_swapTokensForExactTokens_wethIn(xfai_factory, xfai_periphery,):
    owner = accounts[1]
    periphery, mock_weth, token1, _ = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool1.get_input_amount(pool1_amount_out, is_input_weth = True)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapTokensForExactTokens(
        owner,
        mock_weth.address,
        token1.address,
        pool1_amount_out,
        pool2_amount_in_max,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == optimal_pool2_amount
    assert tx_event["output"] == pool1_amount_out + 2

def test_swapTokensForExactTokens_wethOut(xfai_factory, xfai_periphery,):
    owner = accounts[1]
    periphery, mock_weth, token1, _ = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool1.get_input_amount(pool1_amount_out)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapTokensForExactTokens(
        owner,
        token1.address,
        mock_weth.address,
        pool1_amount_out,
        pool2_amount_in_max,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == optimal_pool2_amount
    assert tx_event["output"] == pool1_amount_out


def test_swapTokensForExactTokens_revert(xfai_factory, xfai_periphery,):
    owner = accounts[1]
    periphery, _, token1, token2 = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    pool2_address = xfai_factory.getPool(token2.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool2, pool1)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool_pair.get_input_amount(pool1_amount_out)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    error_message = 'XfaiV0Periphery03: INSUFFICIENT_INPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapTokensForExactTokens(
            owner,
            token2.address,
            token1.address,
            pool1_amount_out + 1e17,
            pool2_amount_in_max,
            deadline,
            {"from": owner}
        )


#### swapExactETHForTokens permutations

def test_swapExactETHForTokens(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, _, token1, _ = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    optimal_pool1_amount = pool1.get_output_amount(pool2_amount, is_input_weth=True)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapExactETHForTokens(
        owner,
        token1.address,
        pool1_amount_min,
        deadline,
        {"from": owner, "value": pool2_amount}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == pool2_amount
    assert tx_event["output"] == optimal_pool1_amount

def test_swapExactETHForTokens_revert(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, token1, _ = xfai_periphery
    pool2_amount = 1e17
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    optimal_pool1_amount = pool1.get_output_amount(pool2_amount, is_input_weth=True)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    error_message = 'XfaiV0Periphery03: INSUFFICIENT_OUTPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapExactETHForTokens(
            owner,
            token1.address,
            pool1_amount_min + 1e17,
            deadline,
            {"from": owner, "value": pool2_amount}
        )
    

#### swapTokensForExactETH permutations

def test_swapTokensForExactETH(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, _, _, token2 = xfai_periphery
    pool2_address = xfai_factory.getPool(token2.address)
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool2 = Pool(CHAIN_ID, token2.address, w2, r2, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool2.get_input_amount(pool1_amount_out, is_input_weth=True)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    balance = owner.balance()
    tx = periphery.swapTokensForExactETH(
        owner,
        token2.address,
        pool1_amount_out,
        pool2_amount_in_max,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert abs(tx_event["input"] - optimal_pool2_amount) <= 10
    assert tx_event["output"] == pool1_amount_out
    assert owner.balance() == balance + pool1_amount_out

def test_swapTokensForExactETH_wethIn(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, _, _ = xfai_periphery
    pool1_amount_out = int(1e17)
    pool2_amount_in_max = pool1_amount_out + int(Fraction(pool1_amount_out) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    balance = owner.balance()
    tx = periphery.swapTokensForExactETH(
        owner,
        mock_weth.address,
        pool1_amount_out,
        pool2_amount_in_max,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Withdrawal"]
    assert tx_event["src"] == periphery.address
    assert tx_event["wad"] == pool1_amount_out
    assert owner.balance() == balance + pool1_amount_out

def test_swapTokensForExactETH_revert(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, _, token2 = xfai_periphery
    pool2_address = xfai_factory.getPool(token2.address)
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool2.get_input_amount(pool1_amount_out)
    pool2_amount_in_max = optimal_pool2_amount + int(Fraction(optimal_pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    error_message = 'XfaiV0Periphery03: INSUFFICIENT_INPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapTokensForExactETH(
            owner,
            token2.address,
            pool1_amount_out,
            pool2_amount_in_max - 1e17,
            deadline,
            {"from": owner}
        )


#### swapExactTokensForETH permutations

def test_swapExactTokensForETH(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, _, _, token2 = xfai_periphery
    pool2_amount = 1e17
    pool2_address = xfai_factory.getPool(token2.address)
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool2 = Pool(CHAIN_ID, token2.address, w2, r2, swapFee)
    optimal_pool1_amount = pool2.get_output_amount(pool2_amount, is_input_weth=True)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    balance = owner.balance()
    tx = periphery.swapExactTokensForETH(
        owner,
        token2.address,
        pool2_amount,
        pool1_amount_min,
        deadline,
        {"from": owner}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == pool2_amount
    assert tx_event["output"] == optimal_pool1_amount
    assert owner.balance() == balance + optimal_pool1_amount

def test_swapExactTokensForETH_wethIn(xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, _, _ = xfai_periphery
    pool2_amount = 1e17

    pool1_amount_min = pool2_amount - int(Fraction(pool2_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    balance = owner.balance()
    tx = periphery.swapExactTokensForETH(
        owner,
        mock_weth.address,
        pool2_amount,
        pool1_amount_min,
        deadline,
        {"from": owner}
    )

    tx_event = tx.events["Withdrawal"]
    assert tx_event["src"] == periphery.address
    assert tx_event["wad"] == pool2_amount
    assert owner.balance() == balance + pool2_amount

def test_swapExactTokensForETH_revert(xfai_factory,xfai_periphery):
    owner = accounts[1]
    periphery, mock_weth, _, token2 = xfai_periphery
    pool2_amount = 1e17
    pool2_address = xfai_factory.getPool(token2.address)
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    optimal_pool1_amount = pool2.get_output_amount(pool2_amount)
    pool1_amount_min = optimal_pool1_amount - int(Fraction(optimal_pool1_amount) * slippage_tolerance / 1000)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    error_message = 'XfaiV0Periphery03: INSUFFICIENT_OUTPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapExactTokensForETH(
            owner,
            token2.address,
            pool2_amount - 1e16,
            pool1_amount_min,
            deadline,
            {"from": owner}
    )


#### swapETHForExactTokens permutations

def test_swapETHForExactTokens(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, _, token1, _ = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool1.get_input_amount(pool1_amount_out, is_input_weth=True)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    tx = periphery.swapETHForExactTokens(
        owner,
        token1.address,
        pool1_amount_out,
        deadline,
        {"from": owner, "value": optimal_pool2_amount}
    )
    tx_event = tx.events["Swap"]
    assert tx_event["input"] == optimal_pool2_amount
    assert tx_event["output"] - (pool1_amount_out + 5) < 2


def test_swapETHForExactTokens_revert(xfai_factory, xfai_periphery):
    owner = accounts[1]
    periphery, _, token1, _ = xfai_periphery
    pool1_address = xfai_factory.getPool(token1.address)
    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool1_amount_out = int(1e17)
    optimal_pool2_amount = pool1.get_input_amount(pool1_amount_out, is_input_weth = True)
    deadline = int((datetime.fromtimestamp(chain.time()) + delta).timestamp())
    error_message = 'XfaiV0Periphery03: INSUFFICIENT_INPUT_AMOUNT'
    with brownie.reverts(error_message):
        periphery.swapETHForExactTokens(
            owner,
            token1.address,
            pool1_amount_out,
            deadline,
            {"from": owner, "value": optimal_pool2_amount - 1e16}
        )