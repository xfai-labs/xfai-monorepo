import pytest
import math
from web3 import Web3
from eth_abi.packed import encode_abi_packed
from brownie import XfaiLibrary, MockWETH, MockERC20, XfaiV0Core, XfaiFactory, accounts, interface
import brownie

@pytest.fixture(scope="function")
def token():
    return accounts[0].deploy(MockERC20, accounts[1], 1e28)

@pytest.fixture(scope="module")
def mock_weth():
    return accounts[0].deploy(MockWETH)

@pytest.fixture(scope="function")
def xfai_factory(mock_weth):
    return accounts[0].deploy(XfaiFactory, accounts[1], mock_weth)

@pytest.fixture(scope="function")
def xfai_core(xfai_factory, mock_weth):
    accounts[0].deploy(XfaiLibrary)
    return accounts[0].deploy(XfaiV0Core, xfai_factory.address, accounts[0], mock_weth.address, 15, 15)

def test_create_pool(xfai_factory, xfai_core, token):
    user = accounts[2]
    owner = accounts[1]
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    tx = xfai_factory.createPool(token.address, {"from": owner})
    pool_address = xfai_factory.getPool(token.address)
    pool = interface.IXfaiPool(pool_address)
    tx_event = tx.events["PoolCreated"]
    assert tx_event['token'] == token.address
    assert tx_event['pool'] == pool_address
    assert tx_event['allPoolsSize'] == 1
    assert token.address == pool.poolToken()
    assert pool.getXfaiCore() == xfai_core.address
    assert xfai_factory.allPoolsLength() == 1
    init_code_hash = str(xfai_factory.poolCodeHash())
    token_address = Web3.toChecksumAddress(token.address)
    factory_address = xfai_factory.address
    b_salt = Web3.keccak(encode_abi_packed(['address'], [token_address]))
    pre = '0xff'
    b_pre = bytes.fromhex(pre[2:])
    b_address = bytes.fromhex(factory_address[2:])
    b_init_code = bytes.fromhex(init_code_hash[2:])
    b_result = Web3.keccak(
        encode_abi_packed(['bytes', 'bytes', 'bytes', 'bytes'], [b_pre, b_address, b_salt, b_init_code]))
    result_address = Web3.toChecksumAddress(b_result[12:].hex())
    assert result_address == pool_address


def test_create_pool_reverts(xfai_core, xfai_factory, mock_weth, token):
    error_message_1 = "XfaiFactory: ZERO_ADDRESS"
    error_message_2 = "XfaiFactory: POOL_EXISTS"
    error_message_3 = "XfaiFactory: WETH_ADDRESS"
    zero_address = "0x"+'0'*40
    owner = accounts[1]
    xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    with brownie.reverts(error_message_1):
        xfai_factory.createPool(zero_address, {"from": owner})
    xfai_factory.createPool(token.address, {"from": owner})
    with brownie.reverts(error_message_2):
        xfai_factory.createPool(token.address, {"from": owner})
    with brownie.reverts(error_message_3):
        xfai_factory.createPool(mock_weth.address, {"from": owner})

def test_setOwner(xfai_factory):
    owner = accounts[1]
    new_owner = accounts[2]
    tx = xfai_factory.setOwner(new_owner, {'from': owner})
    assert xfai_factory.getOwner() == new_owner
    tx_event = tx.events["ChangedOwner"]
    assert tx_event['owner'] == new_owner

def test_setOwner_reverts(xfai_factory):
    not_owner = accounts[2]
    error_message = "XfaiFactory: NOT_OWNER"
    with brownie.reverts(error_message):
        xfai_factory.setOwner(not_owner, {'from': not_owner})

def test_setXfaiCore(xfai_factory, xfai_core):
    owner = accounts[1]
    tx = xfai_factory.setXfaiCore(xfai_core.address, {'from': owner})
    assert xfai_factory.getXfaiCore() == xfai_core.address
    tx_event = tx.events["ChangedCore"]
    assert tx_event['core'] == xfai_core.address

def test_setXfaiCore_reverts(xfai_factory, xfai_core):
    not_owner = accounts[2]
    error_message = "XfaiFactory: NOT_OWNER"
    with brownie.reverts(error_message):
        xfai_factory.setXfaiCore(xfai_core.address, {'from': not_owner})
