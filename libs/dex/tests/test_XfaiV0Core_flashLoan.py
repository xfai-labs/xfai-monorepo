import pytest
from brownie import XfaiLibrary, MockWETH, MockERC20, MockFlashLoan, XfaiV0Core, XfaiFactory, XfaiPool, accounts, interface
import brownie

@pytest.fixture(scope="function")
def token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def flashContract(token, mock_weth):
    return accounts[0].deploy(MockFlashLoan, token.address, mock_weth.address)

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)
    return factory

@pytest.fixture(scope="function")
def fake_token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def fake_pool():
    return accounts[0].deploy(XfaiPool)

@pytest.fixture(scope="function")
def xfai_core(xfai_factory, mock_weth):
    accounts[0].deploy(XfaiLibrary)
    return accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth, 20, 20)

def test_flashLoanZeroOne(mock_weth, xfai_factory, xfai_core, token, flashContract):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e18, 1e18
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the weth
    xfai_factory.createPool(token.address)
    pool1_address = xfai_factory.getPool(token.address)
    token.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token.address, user, {'from': owner})

    flash_loan_amount = 1e12
    flashContract_reserve = int(flash_loan_amount * 40 / 10000)
    token.transfer(flashContract.address, flashContract_reserve, {'from': owner})
    mock_weth.transfer(flashContract.address, flashContract_reserve, {'from': owner})

    tx = xfai_core.flashLoan(token.address, 0, flash_loan_amount, flashContract.address, b'')
    tx_event = tx.events["FlashLoan"]
    assert tx_event["sender"] == flashContract.address
    assert tx_event["tokenAmount"] == 0
    assert tx_event["wethAmount"] == flash_loan_amount
    assert interface.IERC20(mock_weth).balanceOf(pool1_address) == pool1_amount + int(flashContract_reserve / 2)

def test_flashLoanOneZero(mock_weth, xfai_factory, xfai_core, token, flashContract):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e18, 1e18
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the xfETH
    xfai_factory.createPool(token.address)
    pool1_address = xfai_factory.getPool(token.address)
    token.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token.address, user, {'from': owner})

    flash_loan_amount = 1e12
    flashContract_reserve = int(flash_loan_amount * 40 / 10000)
    token.transfer(flashContract.address, flashContract_reserve, {'from': owner})
    mock_weth.transfer(flashContract.address, flashContract_reserve, {'from': owner})

    tx = xfai_core.flashLoan(token.address, flash_loan_amount, 0, flashContract.address, b'')
    tx_event = tx.events["FlashLoan"]
    assert tx_event["sender"] == flashContract.address
    assert tx_event["tokenAmount"] == flash_loan_amount
    assert tx_event["wethAmount"] == 0
    assert interface.IERC20(token).balanceOf(pool1_address) == pool1_amount + int(flashContract_reserve / 2)

def test_flashLoanOneOne(mock_weth, xfai_factory, xfai_core, token, flashContract):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e18, 1e18
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the xfETH
    xfai_factory.createPool(token.address)
    pool1_address = xfai_factory.getPool(token.address)
    token.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token.address, user, {'from': owner})

    flash_loan_amount = 1e12
    flashContract_reserve = int(flash_loan_amount * 40 / 10000)
    token.transfer(flashContract.address, flashContract_reserve, {'from': owner})
    mock_weth.transfer(flashContract.address, flashContract_reserve, {'from': owner})

    tx = xfai_core.flashLoan(token.address, flash_loan_amount, flash_loan_amount, flashContract.address, b'')
    tx_event = tx.events["FlashLoan"]
    assert tx_event["sender"] == flashContract.address
    assert tx_event["tokenAmount"] == flash_loan_amount
    assert tx_event["wethAmount"] == flash_loan_amount
    assert interface.IERC20(token).balanceOf(pool1_address) == pool1_amount + int(flashContract_reserve / 2)
    assert interface.IERC20(mock_weth).balanceOf(pool1_address) == pool1_amount + int(flashContract_reserve / 2)

def test_flashLoanZeroZero(mock_weth, xfai_factory, xfai_core, token, flashContract):
    owner = accounts[1]
    user = accounts[3]
    pool1_amount, pool1_weight= 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the xfETH
    xfai_factory.createPool(token.address)
    pool1_address = xfai_factory.getPool(token.address)
    token.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token.address, user, {'from': owner})

    flash_loan_amount = 1e12
    flashContract_reserve = int(flash_loan_amount * 40 / 10000)
    token.transfer(flashContract.address, flashContract_reserve, {'from': owner})

    tx = xfai_core.flashLoan(token.address, 0, 0, flashContract.address, b'')
    tx_event = tx.events["FlashLoan"]
    assert tx_event["sender"] == flashContract.address
    assert tx_event["tokenAmount"] == 0
    assert tx_event["wethAmount"] == 0
    assert interface.IERC20(token).balanceOf(pool1_address) == pool1_amount
    assert interface.IERC20(mock_weth).balanceOf(pool1_address) == pool1_weight

def test_flashLoan_reverts(mock_weth, xfai_factory, xfai_core, token, flashContract, fake_pool, fake_token):
    owner = accounts[1]
    zero_address = "0x"+'0'*40
    pool1_amount, pool1_weight= 1e12, 1e10
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    mock_weth.deposit({'from': owner, 'value': pool1_weight * 2}) # mint the xfETH
    xfai_factory.createPool(token.address)
    pool1_address = xfai_factory.getPool(token.address)
    token.transfer(pool1_address, pool1_amount, {'from': owner})
    mock_weth.transfer(pool1_address, pool1_weight, {'from': owner})
    xfai_core.mint(token.address, owner, {'from': owner})

    flash_loan_amount = 1e12

    # test invalid to
    error_message_2 = "XfaiV0Core INVALID_TO"
    with brownie.reverts(error_message_2):
        xfai_core.flashLoan(token.address, flash_loan_amount, 0, zero_address, b'')

    # test invalid pool
    error_message_3 = ""
    with brownie.reverts(error_message_3):
        fake_pool.initialize(fake_token.address, xfai_factory.address)
        xfai_core.flashLoan(fake_token.address, flash_loan_amount, 0, flashContract.address, b'')

    # test insufficient output amount
    error_message_4 = "XfaiV0Core: INSUFFICIENT_AMOUNT"
    with brownie.reverts(error_message_4):
        xfai_core.flashLoan(token.address, 1e20, 0, flashContract.address, b'')

    # test insufficient amount returned
    error_message_5 = "XfaiV0Core: INSUFFICIENT_AMOUNT_RETURNED"
    with brownie.reverts(error_message_5):
        xfai_core.flashLoan(token.address, flash_loan_amount, 0, flashContract.address, b'')
