import pytest
import math
from brownie import XfaiLibrary, MockERC20, MockWETH, XfaiV0Core, XfaiFactory, accounts, interface
import brownie

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

def test_create_core_contract_creation(xfai_core):
    assert xfai_core.lpFee() == 20
    assert xfai_core.infinityNFTFee() == 20

def test_totalFees(xfai_core):
    assert xfai_core.getTotalFee() == 40

def test_change_core_fees(xfai_core):
    owner = accounts[1]
    tx1 = xfai_core.changeLpFee(5, {"from": owner})
    tx2 = xfai_core.changeInfinityNFTFee(3, {"from": owner})
    assert xfai_core.lpFee() == 5
    assert xfai_core.infinityNFTFee() == 3
    assert xfai_core.getTotalFee() == 8
    tx_event1 = tx1.events["LpFeeChange"]
    tx_event2 = tx2.events["InfinityNFTFeeChange"]
    assert tx_event1['newFee'] == 5
    assert tx_event2['newFee'] == 3

def test_change_core_fees_reverts(xfai_core):
    not_owner = accounts[0]
    error_message = "XfaiV0Core: NOT_OWNER"
    with brownie.reverts(error_message):
        xfai_core.changeLpFee(5, {"from": not_owner})
    with brownie.reverts(error_message):
        xfai_core.changeInfinityNFTFee(10, {"from": not_owner})