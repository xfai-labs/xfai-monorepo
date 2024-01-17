import pytest
from brownie import XfaiLibrary, MockWETH, MockERC20, XfaiV0Core, XfaiFactory, accounts, interface
import brownie
from xfaipy.pool import Pool
from xfaipy.pool_pair import PoolPair
from fractions import Fraction

CHAIN_ID = 5777 # Ganache. Not used in tests

@pytest.fixture(scope="function")
def token1():
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
    

def test_mint(xfai_core, xfai_factory, token1, mock_weth):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the xfETH

    xfai_factory.createPool(token1.address)
    pool1_address = xfai_factory.getPool(token1.address)

    # first time mint
    r1, w1 = interface.IXfaiPool(pool1_address).getStates()
    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity_2b_minted = pool1.get_liquidity_minted(pool1_amount, pool1_weight, 0)
    token1.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    tx = xfai_core.mint(token1.address, user, {'from': owner})
    tx_event = tx.events["Mint"]
    assert tx_event["sender"] == owner
    assert tx_event['liquidity'] == liquidity_2b_minted
    first_time_total_supply = tx_event['liquidity'] + 10**3
    assert interface.IERC20(pool1_address).totalSupply() == first_time_total_supply

    # second time mint
    r1, w1 = interface.IXfaiPool(pool1_address).getStates()
    swapFee = xfai_core.getTotalFee()
    pool1 = Pool(CHAIN_ID, token1.address, r1, w1, swapFee)
    liquidity_2b_minted = pool1.get_liquidity_minted(pool1_amount, pool1_weight, first_time_total_supply)
    token1.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    tx = xfai_core.mint(token1.address, user, {'from': owner})
    tx_event = tx.events["Mint"]
    assert tx_event["sender"] == owner
    assert tx_event['liquidity'] == liquidity_2b_minted
    assert interface.IERC20(pool1_address).totalSupply() == tx_event['liquidity'] + first_time_total_supply
