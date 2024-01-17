import pytest
from brownie import XfaiLibrary, MockERC20, MockWETH, XfaiV0Core, XfaiFactory, accounts, interface
import brownie
from xfaipy.pool import Pool
from xfaipy.pool_pair import PoolPair

CHAIN_ID = 5777 # Ganache. Not used in tests

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

def test_swap_token_to_token(xfai_core, xfai_factory, mock_weth, token1, token2):
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
    pool_pair = PoolPair(pool2, pool1)
    amount2_in = 1e18
    lnft_fee_portion = int(amount2_in * xfai_core.infinityNFTFee() / 10000)
    amount1_out = pool_pair.get_output_amount(amount2_in)
    weight_change = pool2.get_output_amount(amount2_in)

    token2.transfer(pool2_address, amount2_in, {'from': owner})
    tx = xfai_core.swap(token2, token1, owner, {'from': owner})
    tx_event = tx.events["Swap"]
    new_r1, new_w1 = interface.IXfaiPool(pool1_address).getStates()
    new_r2, new_w2 = interface.IXfaiPool(pool2_address).getStates()

    assert r2 + amount2_in - lnft_fee_portion == new_r2
    assert w2 - weight_change == new_w2
    assert r1 - amount1_out == new_r1
    assert w1 + weight_change == new_w1
    assert new_r2 == interface.IERC20(token2).balanceOf(pool2_address)
    assert new_r1 == interface.IERC20(token1).balanceOf(pool1_address)
    assert tx_event["sender"] == owner
    assert tx_event["input"] == amount2_in
    assert tx_event["output"] == amount1_out
    assert tx_event["to"] == owner

def test_swap_token_to_weth(xfai_core, xfai_factory, mock_weth, token2):
    owner = accounts[1]
    user = accounts[3]
    pool2_amount, pool2_weight = 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool2_weight}) # mint the weth

    xfai_factory.createPool(token2.address)
    pool2_address = xfai_factory.getPool(token2.address)

    token2.transfer(pool2_address, pool2_amount, {'from': owner})
    mock_weth.transfer(pool2_address, pool2_weight, {'from': owner})
    xfai_core.mint(token2.address, user, {'from': owner})

    r2,w2 = interface.IXfaiPool(pool2_address).getStates()

    swapFee = xfai_core.getTotalFee()
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    amount2_in = 1e18
    lnft_fee_portion = int(amount2_in * xfai_core.infinityNFTFee() / 10000)
    amount1_out = pool2.get_output_amount(amount2_in)

    token2.transfer(pool2_address, amount2_in, {'from': owner})
    tx = xfai_core.swap(token2, mock_weth, owner, {'from': owner})
    tx_event = tx.events["Swap"]
    new_r2, new_w2 = interface.IXfaiPool(pool2_address).getStates()

    assert r2 + amount2_in - lnft_fee_portion == new_r2
    assert w2 - amount1_out == new_w2
    assert new_r2 == interface.IERC20(token2).balanceOf(pool2_address)
    assert new_w2 == interface.IERC20(mock_weth).balanceOf(pool2_address)
    assert tx_event["sender"] == owner
    assert tx_event["input"] == amount2_in
    assert tx_event["output"] == amount1_out
    assert tx_event["to"] == owner

def test_swap_weth_to_token(xfai_core, xfai_factory, mock_weth, token2):
    owner = accounts[1]
    user = accounts[3]
    pool2_amount, pool2_weight = 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool2_weight + 1e10}) # mint the weth

    xfai_factory.createPool(token2.address)
    pool2_address = xfai_factory.getPool(token2.address)

    token2.transfer(pool2_address, pool2_amount, {'from': owner})
    mock_weth.transfer(pool2_address, pool2_weight, {'from': owner})
    xfai_core.mint(token2.address, user, {'from': owner})

    r2,w2 = interface.IXfaiPool(pool2_address).getStates()

    swapFee = xfai_core.getTotalFee()
    pool2 = Pool(CHAIN_ID, token2.address, r2, w2, swapFee)
    amountWeth_in = 1e10
    lnft_fee_portion = int(amountWeth_in * xfai_core.infinityNFTFee() / 10000)
    amount1_out = pool2.get_output_amount(amountWeth_in, is_input_weth = True)

    mock_weth.transfer(pool2_address, amountWeth_in, {'from': owner})
    tx = xfai_core.swap(mock_weth, token2, owner, {'from': owner})
    tx_event = tx.events["Swap"]
    new_r2, new_w2 = interface.IXfaiPool(pool2_address).getStates()

    assert r2 - amount1_out == new_r2
    assert w2 + amountWeth_in - lnft_fee_portion == new_w2
    assert new_r2 == interface.IERC20(token2).balanceOf(pool2_address)
    assert new_w2 == interface.IERC20(mock_weth).balanceOf(pool2_address)
    assert tx_event["sender"] == owner
    assert tx_event["input"] == amountWeth_in
    assert tx_event["output"] == amount1_out
    assert tx_event["to"] == owner

def test_swap_weth_reverts(xfai_core, xfai_factory, mock_weth, token2, token1):
    owner = accounts[1]
    user = accounts[3]
    pool2_amount, pool2_weight = 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool2_weight + 2e10}) # mint the weth

    xfai_factory.createPool(token2.address)
    pool2_address = xfai_factory.getPool(token2.address)

    token2.transfer(pool2_address, pool2_amount, {'from': owner})
    mock_weth.transfer(pool2_address, pool2_weight, {'from': owner})
    xfai_core.mint(token2.address, user, {'from': owner})

    amountWeth_in = 1e10

    error_message0 = 'Xfai: INSUFFICIENT_AMOUNT'
    with brownie.reverts(error_message0):
        xfai_core.swap(mock_weth, token2, owner, {'from': owner})

    mock_weth.transfer(pool2_address, amountWeth_in, {'from': owner})

    error_message1 = 'XfaiV0Core: IDENTICAL_POOLS'
    with brownie.reverts(error_message1):
        xfai_core.swap(mock_weth, mock_weth, owner, {'from': owner})
    
    error_message2 = 'XfaiV0Core: INVALID_TO'
    with brownie.reverts(error_message2):
        xfai_core.swap(mock_weth, token2, token2, {'from': owner})
    
    error_message3 = 'Xfai: INSUFFICIENT_LIQUIDITY'
    xfai_factory.createPool(token1.address, {"from": owner})
    pool1_address = xfai_factory.getPool(token1.address)
    mock_weth.transfer(pool1_address, amountWeth_in, {'from': owner})
    with brownie.reverts(error_message3):
        xfai_core.swap(mock_weth, token1, owner, {'from': owner})