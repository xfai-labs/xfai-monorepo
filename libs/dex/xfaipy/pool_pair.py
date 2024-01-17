#!/usr/bin/python3

from xfaipy.pool import Pool
from fractions import Fraction
from typing import Tuple

class PoolPair:

    def __init__(self, pool0: Pool, pool1: Pool):
        self.pool0 = pool0
        self.pool1 = pool1

    def get_output_amount(self, input_amount: int, without_fee: bool = False) -> int:
        input = self.pool0.get_output_amount(input_amount, without_fee)
        output = input * self.pool1.reserve / (self.pool1.weight + input)
        return int(output)

    def get_input_amount(self, output_amount: int, without_fee: bool = False) -> int:
        assert self.pool1.reserve > output_amount, "Output exceeds reserve"
        output_amount = Fraction(output_amount)
        numerator = output_amount * self.pool1.weight
        denominator = self.pool1.reserve - output_amount
        w0Out = (numerator / denominator) + 1
        input = self.pool0.get_input_amount(w0Out, without_fee)
        return input
    
    def get_liquidity_value(self, liquidity: int, total_supply: int) -> Tuple[int,int]:
        amount0, amount1 = self.pool0.get_liquidity_value(liquidity, total_supply)
        return amount0, self.pool1.get_output_amount(amount1, without_fee = False, is_input_weth = True)
