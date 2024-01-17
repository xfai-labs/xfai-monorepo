#!/usr/bin/python3
import eth_keys
from eth_account._utils.signing import sign_message_hash
from eth_abi import encode_abi
from hexbytes import HexBytes
from web3 import Web3

def permit_digest(private_key, domain_seperator, _owner, spender, value, nonce, deadline):
    typehash = Web3.keccak(text= "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
    
    message = Web3.keccak(encode_abi(
        ['bytes32','address','address', 'uint256', 'uint256', 'uint256'], 
        [typehash, _owner, spender, value, nonce, deadline]))#.hex()

    digest = Web3.solidityKeccak(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        [bytes.fromhex('0x19'[2:]), bytes.fromhex('0x01'[2:]), domain_seperator, message]
    )
    eth_private_key = eth_keys.keys.PrivateKey(HexBytes(private_key))
    (v, r, s, _) = sign_message_hash(eth_private_key, HexBytes(digest.hex()))
    return v, r, s


def sign_permit2(
        private_key, 
        domain_seperator, # permit2 domain seperator
        token, # ERC20 token address
        max_amount, # the maximum amount that can be spent
        spender, # recipient address
        nonce, # a unique value for every token owner's signature to prevent signature replays
        deadline # deadline on the permit signature
    ):
    PERMIT_TRANSFER_FROM_TYPEHASH = Web3.keccak(text= "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)")
    TOKEN_PERMISSIONS_TYPEHASH = Web3.keccak(text= "TokenPermissions(address token,uint256 amount)")
    
    token_permissions_typehash_message = Web3.keccak(encode_abi(
        ['bytes32','address', 'uint256'], 
        [TOKEN_PERMISSIONS_TYPEHASH, token, max_amount]
    ))
    
    permit_transfer_from_typehash_message = Web3.keccak(encode_abi(
        ['bytes32', 'bytes32'],
        [PERMIT_TRANSFER_FROM_TYPEHASH, token_permissions_typehash_message]
    ))

    digest = Web3.solidityKeccak(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32', 'address', 'uint256', 'uint256'],
        [bytes.fromhex('0x19'[2:]), 
         bytes.fromhex('0x01'[2:]), 
         domain_seperator, 
         permit_transfer_from_typehash_message, 
         spender, 
         nonce, 
         deadline
        ]
    )
    eth_private_key = eth_keys.keys.PrivateKey(HexBytes(private_key))
    (v, r, s, eth_signature_bytes) = sign_message_hash(eth_private_key, HexBytes(digest.hex()))
    
    return eth_signature_bytes#.hex()