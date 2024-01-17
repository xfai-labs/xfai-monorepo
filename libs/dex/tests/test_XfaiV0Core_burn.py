import pytest
from brownie import XfaiLibrary, MockWETH, MockERC20, XfaiV0Core, XfaiFactory, accounts, interface
import brownie
from xfaipy.pool import Pool
from xfaipy.pool_pair import PoolPair

CHAIN_ID = 5777 # Ganache. Not used in tests
swapFee = 4

@pytest.fixture(scope="function")
def token1():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def token2():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)
    return factory

@pytest.fixture(scope="function")
def xfai_core(xfai_factory, mock_weth):
    accounts[0].deploy(XfaiLibrary)
    return accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth, 20, 20)
    

def test_burn_token_weth(mock_weth, xfai_core, xfai_factory, token1):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the weth
    xfai_factory.createPool(token1.address)
    pool1_address = xfai_factory.getPool(token1.address)
    r1, w1 = interface.IXfaiPool(pool1_address).getStates()
    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    token1.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token1.address, user, {'from': owner})

    user_lp_balance = interface.IERC20(pool1_address).balanceOf(user)
    interface.IERC20(pool1_address).transfer(xfai_core.address, user_lp_balance, {"from": user})

    r1, w1 = interface.IXfaiPool(pool1_address).getStates()
    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity_value = pool1.get_liquidity_value(user_lp_balance, interface.IERC20(pool1_address).totalSupply())

    tx = xfai_core.burn(token1.address, mock_weth.address, owner, {"from": user})
    tx_event = tx.events["Burn"]
    assert tx_event["sender"] == user
    assert tx_event["amount0"] == liquidity_value[0]
    assert tx_event["amount1"] == liquidity_value[1]
    assert tx_event["to"] == owner
    assert interface.IERC20(pool1_address).balanceOf(user) == 0
    assert interface.IERC20(pool1_address).totalSupply() == 1000 # min liquidity that was permanently locked
    
    r1, w1 = interface.IXfaiPool(pool1_address).getStates()
    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity_value = pool1.get_liquidity_value(1000, interface.IERC20(pool1_address).totalSupply())
    assert r1 == liquidity_value[0]
    assert w1 == liquidity_value[1]


def test_burn_token_token(mock_weth, xfai_core, xfai_factory, token1, token2):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight, pool2_amount, pool2_weight= 1e12, 1e10, 1e20, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight + pool2_weight}) # mint the weth

    xfai_factory.createPool(token1.address)
    xfai_factory.createPool(token2.address)
    pool1_address = xfai_factory.getPool(token1.address)
    pool2_address = xfai_factory.getPool(token2.address)

    token1.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token1.address, user, {'from': owner})

    token2.transfer(pool2_address, pool2_amount, {'from': owner})
    mock_weth.transfer(pool2_address, pool2_weight, {'from': owner})
    xfai_core.mint(token2.address, user, {'from': owner})

    r1,w1 = interface.IXfaiPool(pool1_address).getStates()
    r2,w2 = interface.IXfaiPool(pool2_address).getStates()

    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    pool_pair = PoolPair(pool1, pool2)

    user_lp_balance = interface.IERC20(pool1_address).balanceOf(user)
    interface.IERC20(pool1_address).transfer(xfai_core.address, user_lp_balance, {"from": user})
    liquidity_value = pool_pair.get_liquidity_value(user_lp_balance, interface.IERC20(pool1_address).totalSupply())

    tx = xfai_core.burn(token1.address, token2.address, owner, {"from": user})
    tx_event = tx.events["Burn"]
    assert tx_event["sender"] == user
    assert tx_event["amount0"] == liquidity_value[0]
    assert tx_event["amount1"] == liquidity_value[1]
    assert tx_event["to"] == owner
    assert interface.IERC20(mock_weth).balanceOf(pool1_address) < w1
    assert interface.IERC20(token1).balanceOf(pool1_address) == r1 - tx_event["amount0"]
    assert interface.IERC20(mock_weth).balanceOf(pool2_address) > w2
    assert interface.IERC20(token2).balanceOf(pool2_address) == r2 - tx_event["amount1"]

    assert interface.IERC20(pool1_address).balanceOf(user) == 0
    assert interface.IERC20(pool1_address).totalSupply() == 1000 # min liquidity that was permanently locked
    

def test_burn_reverts(mock_weth, xfai_core, xfai_factory, token1, token2):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the weth
    xfai_factory.createPool(token1.address)
    pool1_address = xfai_factory.getPool(token1.address)
    token1.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token1.address, user, {'from': owner})
    
    # test invalid token
    error_message_1 = "XfaiV0Core: INVALID_PRIMARY_TOKEN"
    with brownie.reverts(error_message_1):
        xfai_core.burn(mock_weth.address, token1.address, owner, {"from": user})

    # test invalid pool
    error_message_2 = ""
    with brownie.reverts(error_message_2):
        xfai_core.burn(token2.address, token1.address, owner, {"from": user})
    with brownie.reverts(error_message_2):
       xfai_core.burn(token1.address, token2.address, owner, {"from": user})

    # test insufficient liquidity burned
    error_message_3 = 'XfaiV0Core: INSUFFICIENT_LIQUIDITY_BURNED'
    with brownie.reverts(error_message_3):
        xfai_core.burn(token1.address, mock_weth.address, owner, {"from": user})
