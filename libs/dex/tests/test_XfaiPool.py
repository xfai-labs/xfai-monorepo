import pytest

from brownie import MockERC20, MockWETH, XfaiPool, XfaiFactory, accounts, interface, chain
from brownie.network.state import Chain
import brownie
from web3 import Web3
from datetime import datetime, timedelta

delta = timedelta(minutes=20)
fake_private_key = 'e58f089539618900d54293abc81872cc4ef6ca68b907fe6c389f6b4af709a1e7'
local =  accounts.add(fake_private_key)
chain_id = 5777

@pytest.fixture(scope="function")
def token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def xfai_pool():
    return accounts[0].deploy(XfaiPool)

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    factory = accounts[0].deploy(XfaiFactory, accounts[2], mock_weth)
    return factory

def test_initialize(token, xfai_pool, xfai_factory):
    user = accounts[0]
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    assert xfai_pool.poolToken() == token.address
    assert xfai_pool.name() == "Xfai Liquidity Token"
    assert xfai_pool.symbol() == "XFAI-LP"

def test_initialize_reverts(token, xfai_pool, xfai_factory):
    user = accounts[0]
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    with brownie.reverts("XfaiPool: DEX_SEEDED"):
        xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})

def test_getState(xfai_pool):
    r, w = xfai_pool.getStates()
    assert r == 0
    assert w == 0

def test_mint(xfai_pool, xfai_factory, token):
    core = accounts[1]
    owner = accounts[2]
    user = accounts[3]
    xfai_factory.setXfaiCore(core, {'from': owner})
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    lp = interface.IERC20(xfai_pool.address)
    amount = 1e18
    current_liquidity = lp.totalSupply()
    assert current_liquidity == 0
    xfai_pool.mint(user, amount, {"from": core})
    assert lp.totalSupply() == amount
    assert lp.balanceOf(user) == amount

def test_mint_reverts(xfai_pool, token, xfai_factory):
    owner = accounts[2]
    user = accounts[3]
    core = accounts[4]
    amount = 1e18
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    xfai_factory.setXfaiCore(core, {'from': owner})
    error_message = "XfaiPool: NOT_CORE"
    with brownie.reverts(error_message):
        xfai_pool.mint(user, amount, {"from": user})


def test_update(xfai_pool, token, xfai_factory):
    owner = accounts[2]
    user = accounts[3]
    core = accounts[4]
    amount = 1e20
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    xfai_factory.setXfaiCore(core, {'from': owner})

    r, w = xfai_pool.getStates()
    new_balance = r + amount
    new_weight = w + amount

    xfai_pool.update(new_balance, new_weight, {"from": core})
    new_reserve, new_w = xfai_pool.getStates()
    assert new_reserve == new_balance
    assert new_w == new_weight


def test_update_reverts(xfai_pool, token, xfai_factory):
    owner = accounts[2]
    user = accounts[3]
    core = accounts[4]
    xfai_pool.initialize(token.address, xfai_factory.address, {"from": user})
    xfai_factory.setXfaiCore(core, {'from': owner})
    error_message = "XfaiPool: NOT_CORE"
    with brownie.reverts(error_message):
        xfai_pool.update(1e18, 1e10, {"from": user})