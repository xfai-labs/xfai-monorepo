#!/usr/bin/python3

from eth_abi.packed import encode_abi_packed
from web3 import Web3
from xfaipy._config import Chain
from fractions import Fraction
from typing import Tuple

def solidity_like_sqrt(y):
    if (y > 3):
        z = y
        x = y / 2 + 1
        while x < z:
            z = Fraction(x)
            x = (Fraction(y) / x + x) / 2
            x,z = int(x), int(z)
    elif (y != 0):
        z = 1
    return z

class Pool:
    def __init__(self, chain_id: int, token_address: str, reserve: int, weight: int, swapFee: int):
        self.chain_id = chain_id
        self.token_address = token_address
        self.reserve = Fraction(reserve)
        self.weight = Fraction(weight)
        self.swapFee = swapFee
        self.min_liquidity = Fraction(10**3)

    def get_address(self) -> str:
        chain = Chain(self.chain_id)
        checksum_address = Web3.toChecksumAddress(self.token_address)
        b_salt = Web3.keccak(encode_abi_packed(['address'], [checksum_address]))
        pre = '0xff'
        b_pre = bytes.fromhex(pre[2:])
        b_address = bytes.fromhex(chain.xfai.xfai_factory_address[2:])
        b_init_code = bytes.fromhex(chain.xfai.xfai_pool_init_code_hash[2:])
        b_result = Web3.keccak(
            encode_abi_packed(['bytes', 'bytes', 'bytes', 'bytes'], [b_pre, b_address, b_salt, b_init_code]))
        return Web3.toChecksumAddress(b_result[12:].hex())

    def get_reserve(self) -> int:
        return self.reserve

    def get_weight(self) -> int:
        return self.weight
    
    def get_output_amount(self, input_amount: int, without_fee: bool = False, is_input_weth: bool = False) -> int:
        n = 0 if without_fee else 1
        if is_input_weth:
            a, b = self.weight, self.reserve
        else:
            a, b = self.reserve, self.weight
        amountInWithFee = Fraction(input_amount) * (10000 - self.swapFee * n)
        numerator = amountInWithFee * b
        output = numerator / (a * 10000 + amountInWithFee)
        return int(output)
    
    def get_input_amount(self, output_amount: int, without_fee: bool = False, is_input_weth: bool = False) -> int:
        n = 0 if without_fee else 1
        if is_input_weth:
            a, b = self.weight, self.reserve
        else:
            a, b = self.reserve, self.weight
        input = output_amount * a * 10000 / ((b - output_amount) * (10000 - self.swapFee * n))
        return int(input) + 1
    
    # use only for mint functionalities
    def quote(self, input_amount: int, a: int, b: int) -> int:
        return int((Fraction(input_amount) * a) / b)

    def get_liquidity_minted(self, amount: int, weight: int, total_supply: int) -> int:
        amount, weight, total_supply = Fraction(amount), Fraction(weight), Fraction(total_supply)
        if total_supply == 0:
            liquidity = solidity_like_sqrt(amount * weight) - self.min_liquidity
        else:
            liquidity = min((amount * total_supply) / self.reserve, (weight * total_supply) / self.weight)
        return int(liquidity)

    def get_liquidity_value(self, liquidity: int, total_supply: int) -> Tuple[int,int]:
        liquidity, total_supply = Fraction(liquidity), Fraction(total_supply)
        amount0 = liquidity * self.reserve / total_supply
        amount1 = liquidity * self.weight / total_supply
        return int(amount0), int(amount1)
