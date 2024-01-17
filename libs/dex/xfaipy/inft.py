#!/usr/bin/python3

from fractions import Fraction
from xfaipy.pool_pair import PoolPair
from xfaipy.pool import Pool

class INFT:
    def __init__(self, chain_id: int, pool_pair: PoolPair, underlying_token_address: str, initial_reserve: int, reserve: int, shares: int):
        self.chain_id = chain_id
        self.underlying_token_pool_address = Pool(chain_id, underlying_token_address, 0,0,0).get_address()
        self.pool_pair = pool_pair
        self.initial_reserve = initial_reserve
        self.reserve = reserve
        self.shares = shares

    def get_share(self, input_amount):
        if self.pool_pair.pool0.get_address() == self.pool_pair.pool1.get_address():
            amount1_out = self.pool_pair.pool0.get_output_amount(input_amount, is_input_weth = True)
            share = Fraction(1e18 * amount1_out) / (self.reserve + input_amount + self.initial_reserve)
        else:
            if self.pool_pair.pool0.get_address() == self.underlying_token_pool_address:
                share = Fraction(1e18 * input_amount) / (self.reserve + input_amount + self.initial_reserve)
            else:
                amount1_out = self.pool_pair.get_output_amount(input_amount)
                share = Fraction(1e18 * amount1_out) / (self.reserve + input_amount + self.initial_reserve)
        return int(share)