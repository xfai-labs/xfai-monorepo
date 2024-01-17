import { Xfai } from '../../xfai';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { Token, isNativeToken, isSharedToken } from '../../xfai-token';
import { TradeType } from '../../pool';
import type { TransactionOptions } from '../core';
import { swapTokensExactInput } from './exact-input';
import { swapTokensExactOutput } from './exact-output';
import { swapEthToWeth, swapWethToEth } from './native-wrapped';

export async function swapTokens<T = TradeType.EXACT_INPUT>(
  xfai: Xfai,
  tradeType: T,
  tokenIn: Token,
  tokenOut: Token,
  amountIn: BigNumber,
  desiredAmountOut: BigNumber,
  options: TransactionOptions,
): Promise<PopulatedTransaction>;
export async function swapTokens<T = TradeType.EXACT_OUTPUT>(
  xfai: Xfai,
  tradeType: T,
  tokenIn: Token,
  tokenOut: Token,
  desiredAmountIn: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions,
): Promise<PopulatedTransaction>;

/**
 * Swap tokens.
 * @param xfai
 * @param tradeType
 * @param tokenIn
 * @param tokenOut
 * @param amountIn
 * @param amountOut
 * @param options
 * @returns
 */
export async function swapTokens<T extends TradeType>(
  xfai: Xfai,
  tradeType: T,
  tokenIn: Token,
  tokenOut: Token,
  amountIn: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions,
): Promise<PopulatedTransaction> {
  if (isSharedToken(xfai, tokenIn) && isSharedToken(xfai, tokenOut)) {
    if (isNativeToken(tokenIn)) {
      return swapEthToWeth(xfai, amountIn, options);
    }
    return swapWethToEth(xfai, amountIn, options);
  }

  if (tradeType === TradeType.EXACT_INPUT) {
    return swapTokensExactInput(xfai, tokenIn, tokenOut, amountIn, amountOut, options);
  }
  return swapTokensExactOutput(xfai, tokenIn, tokenOut, amountIn, amountOut, options);
}
