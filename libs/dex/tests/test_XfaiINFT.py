import pytest
from brownie import MockERC20, MockWETH, XfaiINFT, XfaiFactory, XfaiV0Core, accounts, interface
import brownie
from fractions import Fraction

@pytest.fixture(scope="function")
def token1():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def token2():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def underlying_token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="function")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def xfai_core(xfai_factory, initialized_xfai_inft, mock_weth):
    core = accounts[0].deploy(XfaiV0Core, xfai_factory.address, initialized_xfai_inft.address, mock_weth, 20, 20)
    xfai_factory.setXfaiCore(core.address, {'from': accounts[1]})
    return core

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)
    return factory

@pytest.fixture(scope="function")
def initialized_xfai_inft(xfai_factory, underlying_token, mock_weth):
    inft =  accounts[0].deploy(
        XfaiINFT, 
        xfai_factory, 
        mock_weth,
        underlying_token,
        1e19,
        2
    )
    inft.premint(
        [accounts[0], accounts[1]], 
        [5e17, 5e17], {'from': accounts[1]}
    )
    return inft

@pytest.fixture(scope="function")
def uninitialized_xfai_inft(xfai_factory, underlying_token, mock_weth):
    return accounts[0].deploy(
        XfaiINFT, 
        xfai_factory, 
        mock_weth,
        underlying_token,
        0,
        0
    )


def test_initialize_uninitialized_INFT(uninitialized_xfai_inft):
    assert uninitialized_xfai_inft.reserve() == 0
    assert uninitialized_xfai_inft.initialReserve() == 0
    assert uninitialized_xfai_inft.totalSharesIssued() == 1
    assert uninitialized_xfai_inft.totalSupply() == 0

def test_initialize_initialized_INFT(initialized_xfai_inft):
    assert initialized_xfai_inft.reserve() == 0
    assert initialized_xfai_inft.initialReserve() == 1e19
    assert initialized_xfai_inft.totalSharesIssued() == int(Fraction(1e18) + 1)
    assert initialized_xfai_inft.balanceOf(accounts[0]) == 1
    assert initialized_xfai_inft.balanceOf(accounts[1]) == 1
    assert initialized_xfai_inft.totalSupply() == 2

def test_tokenURI(initialized_xfai_inft):
    initialized_xfai_inft.tokenURI(1) == ''
    initialized_xfai_inft.setBaseURI('potato/', {'from': accounts[1]})
    initialized_xfai_inft.tokenURI(1) == 'potato/1'

def test_shareToTokenAmount(initialized_xfai_inft, token1, token2):
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert amount == 0
    interface.IERC20(token1).transfer(initialized_xfai_inft.address, 1e18, {'from': accounts[1]})
    assert interface.IERC20(token1).balanceOf(initialized_xfai_inft.address) == 1e18
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert amount == int(Fraction(5e17) - 1)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert amount == int(Fraction(5e17) - 1)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token2.address)
    assert amount == 0

def test_mint(initialized_xfai_inft, underlying_token, xfai_factory, token1):
    amount = 1e18
    initial_reserve = initialized_xfai_inft.initialReserve()
    expected_share = int(Fraction(1e18 * amount) / (amount + initialized_xfai_inft.reserve() + initial_reserve))

    interface.IERC20(underlying_token).transfer(xfai_factory.address, 1e18, {'from': accounts[1]})
    initialized_xfai_inft.mint(accounts[1])
    assert initialized_xfai_inft.totalSupply() == 3
    assert initialized_xfai_inft.balanceOf(accounts[1]) == 2
    assert initialized_xfai_inft.tokenByIndex(2) == 3
    assert initialized_xfai_inft.tokenOfOwnerByIndex(accounts[1], 1) == 3
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(3, token1.address)
    assert amount == 0
    interface.IERC20(token1).transfer(initialized_xfai_inft.address, amount, {'from': accounts[1]})
    balance = interface.IERC20(token1).balanceOf(initialized_xfai_inft)
    expected_amount_3 = int(Fraction(balance * expected_share) / initialized_xfai_inft.totalSharesIssued())
    assert abs(amount - expected_amount_3) < 5
    expected_amount_2 = int(Fraction(balance * int(Fraction(5e17)-1)) / initialized_xfai_inft.totalSharesIssued())
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert abs(amount - expected_amount_2) < 20
    expected_amount_1 = int(Fraction(balance * int(Fraction(5e17)-1)) / initialized_xfai_inft.totalSharesIssued())
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert abs(amount - expected_amount_1) < 20

def test_mint_reverts(initialized_xfai_inft):
    with brownie.reverts("XfaiINFT: INSUFICIENT_AMOUNT"):
        initialized_xfai_inft.mint(accounts[1])

def test_boost(initialized_xfai_inft, underlying_token, xfai_factory, token1):
    interface.IERC20(token1).transfer(initialized_xfai_inft.address, 1e18, {'from': accounts[1]})
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert amount == int(Fraction(5e17)-1)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert amount == int(Fraction(5e17)-1)
    amount = 1e18
    interface.IERC20(underlying_token).transfer(xfai_factory.address, amount, {'from': accounts[1]})
    initialized_xfai_inft.boost(2)

    initial_reserve = initialized_xfai_inft.initialReserve()
    expected_share = int(Fraction(1e18 * amount) / (initialized_xfai_inft.reserve() + initial_reserve))
    balance = interface.IERC20(token1).balanceOf(initialized_xfai_inft)
    expected_amount2 = int(Fraction(balance * (int(Fraction(5e17)-1) + expected_share) / initialized_xfai_inft.totalSharesIssued()))
    expected_amount1 = int(Fraction(balance * (int(Fraction(5e17)-1)) / initialized_xfai_inft.totalSharesIssued()))
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert abs(amount - (expected_amount2)) < 43
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert abs(amount - expected_amount1) < 22

def test_boost_reverts(initialized_xfai_inft):
    with brownie.reverts("XfaiINFT: INSUFICIENT_AMOUNT"):
        initialized_xfai_inft.boost(1)

def test_harvestToken1(underlying_token, initialized_xfai_inft):
    owner = accounts[1]
    interface.IERC20(underlying_token).transfer(initialized_xfai_inft.address, 1e18, {'from': owner})
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, underlying_token.address)
    assert amount == int(Fraction(5e17)-1)

    tx = initialized_xfai_inft.harvestToken(underlying_token.address, 2, amount, {'from': owner})
    tx_event = tx.events["HarvestToken"]
    assert tx_event['token'] == underlying_token.address
    assert tx_event['harvestedAmount'] == amount
    assert tx_event['harvestedShare'] == initialized_xfai_inft.INFTShares(2)
    assert tx_event['id'] == 2

def test_harvestToken2(initialized_xfai_inft, token1, token2):
    interface.IERC20(token1).transfer(initialized_xfai_inft.address, 1e18, {'from': accounts[1]})
    interface.IERC20(token2).transfer(initialized_xfai_inft.address, 1e19, {'from': accounts[1]})
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert amount == int(Fraction(5e17)-1)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert amount == int(Fraction(5e17)-1)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token2.address)
    assert amount == int(Fraction(5e18)-5)
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token2.address)
    assert amount == int(Fraction(5e18)-5)
    amount = 4e17
    initialized_xfai_inft.harvestToken(token1.address, 2, amount, {'from': accounts[1]})
    initialized_xfai_inft.harvestToken(token1.address, 1, int(Fraction(5e17)-1), {'from': accounts[0]})
    amount1,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token1.address)
    assert amount1 == int(Fraction(5e17)-1) - amount
    amount1,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token1.address)
    assert amount1 == 0
    amount1,_,_ = initialized_xfai_inft.shareToTokenAmount(2, token2.address)
    assert amount1 == int(Fraction(5e18)-5)
    amount1,_,_ = initialized_xfai_inft.shareToTokenAmount(1, token2.address)
    assert amount1 == int(Fraction(5e18)-5)

def test_harvestToken_reverts(initialized_xfai_inft, token1):
    interface.IERC20(token1).transfer(initialized_xfai_inft.address, 1e18, {'from': accounts[1]})
    amount = 6e17
    message_1 = "XfaiINFT: NOT_INFT_OWNER"
    message_2 = "XfaiINFT: AMOUNT_EXCEEDS_SHARE"
    with brownie.reverts(message_2):
        initialized_xfai_inft.harvestToken(token1.address, 2, amount, {'from': accounts[1]})
    with brownie.reverts(message_1):
        initialized_xfai_inft.harvestToken(token1.address, 2, 1e12, {'from': accounts[2]})

def test_harvestETH(mock_weth, initialized_xfai_inft):
    owner = accounts[1]
    eth_amount = 1e18
    mock_weth.deposit({'from': owner, 'value':eth_amount})
    mock_weth.transfer(initialized_xfai_inft.address, eth_amount, {'from': owner})
    amount,_,_ = initialized_xfai_inft.shareToTokenAmount(2, mock_weth.address)
    assert amount == int(Fraction(5e17)-1)
    assert interface.IERC20(mock_weth).balanceOf(initialized_xfai_inft.address) == eth_amount

    tx = initialized_xfai_inft.harvestETH(2, amount, {'from': owner})
    tx_event = tx.events["HarvestETH"]
    assert tx_event['harvestedAmount'] == amount
    assert tx_event['harvestedShare'] == initialized_xfai_inft.INFTShares(2)
    assert tx_event['id'] == 2