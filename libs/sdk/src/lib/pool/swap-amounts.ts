import { BigNumber } from 'ethers';
import { Xfai } from '../xfai';
import {
  getAdjustedEthOutput,
  getAdjustedEthInput,
  getAdjustedAmountOutput,
  getAdjustedAmountInput,
  getSpotEth,
  calculatePriceImpact,
} from '../xfai-utils';
import { PoolState, TradeType, subtractSwapFee, addSwapFee } from './core';
import { Token, isSharedToken } from '../xfai-token';

export type SwapAmount = {
  amount: BigNumber;
  priceImpact: string;
};

/**
 * Returns the amount of tokenOut after swapping tokenInAmount of tokenIn
 * @param inPoolState
 * @param outPoolState
 * @param inputAmount
 * @returns tokenOutAmount
 */
export function getSwapOutputAmount<P extends PoolState | undefined = PoolState | undefined>(
  xfai: Xfai,
  tokenIn: {
    token: Token;
    state: P;
  },
  tokenOut: {
    token: Token;
    state: P extends undefined ? PoolState : PoolState | undefined;
  },
  inputAmount: BigNumber,
): SwapAmount {
  if (isSharedToken(xfai, tokenIn.token)) {
    if (tokenOut.state === undefined) throw new Error('Wrong arguments');
    const ethAmount = inputAmount;
    const tokenOutAmount = getAdjustedAmountOutput(tokenOut.state, ethAmount);
    const output = subtractSwapFee(xfai, tokenOutAmount);
    return {
      amount: output,
      priceImpact: calculatePriceImpact(ethAmount, getSpotEth(tokenOut.state, output)),
    };
  }

  if (tokenIn.state === undefined) throw new Error('Wrong arguments');

  const amountInMinusFee = subtractSwapFee(xfai, inputAmount);

  const tokenInEthOut = getAdjustedEthOutput(tokenIn.state, amountInMinusFee);

  if (isSharedToken(xfai, tokenOut.token)) {
    const spotEthIn = getSpotEth(tokenIn.state, inputAmount);
    return {
      amount: tokenInEthOut,
      priceImpact: calculatePriceImpact(spotEthIn, tokenInEthOut),
    };
  }
  if (tokenOut.state === undefined) throw new Error('Wrong arguments');

  const output = getAdjustedAmountOutput(tokenOut.state, tokenInEthOut);
  const spotEthIn = getSpotEth(tokenIn.state, inputAmount);
  const spotEthOut = getSpotEth(tokenOut.state, output);
  return {
    amount: output,
    priceImpact: calculatePriceImpact(spotEthIn, spotEthOut),
  };
}
/**
 * Returns the amount of tokenIn needed for swapping tokenOutAmount of tokenIn
 * @param inPoolState
 * @param outPoolState
 * @param tokenInAmount
 * @returns tokenInInput
 */
export function getSwapInputAmount<P extends PoolState | undefined = PoolState | undefined>(
  xfai: Xfai,
  tokenIn: {
    token: Token;
    state: P;
  },
  tokenOut: {
    token: Token;
    state: P extends undefined ? PoolState : PoolState | undefined;
  },
  outputAmount: BigNumber,
): SwapAmount {
  if (isSharedToken(xfai, tokenIn.token)) {
    if (tokenOut.state === undefined) throw new Error('Wrong arguments');
    const outputAmountWithSwapFee = addSwapFee(xfai, outputAmount);
    const spotEthOut = getSpotEth(tokenOut.state, outputAmount);

    const ethInput = getAdjustedEthInput(tokenOut.state, outputAmountWithSwapFee);

    return {
      amount: ethInput,
      priceImpact: calculatePriceImpact(ethInput, spotEthOut),
    };
  }
  if (tokenIn.state === undefined) throw new Error('Wrong arguments');

  let ethInput = outputAmount;
  let spotEthOut = outputAmount;

  if (!isSharedToken(xfai, tokenOut.token)) {
    if (tokenOut.state === undefined) throw new Error('Wrong arguments');
    ethInput = getAdjustedEthInput(tokenOut.state, outputAmount);
    spotEthOut = getSpotEth(tokenOut.state, outputAmount);
  }

  const inputAmount = getAdjustedAmountInput(tokenIn.state, ethInput);

  const tokenInAmount = addSwapFee(xfai, inputAmount);

  const spotEthIn = getSpotEth(tokenIn.state, tokenInAmount);

  return {
    amount: tokenInAmount,
    priceImpact: calculatePriceImpact(spotEthIn, spotEthOut),
  };
}

export function getSwapAmounts<
  T extends TradeType,
  P extends PoolState | undefined = PoolState | undefined,
>(
  xfai: Xfai,
  tradeType: T,
  tokenIn: {
    token: Token;
    state: P;
  },
  tokenOut: {
    token: Token;
    state: P extends undefined ? PoolState : PoolState | undefined;
  },
  amount: BigNumber,
): SwapAmount {
  if (tradeType === TradeType.EXACT_INPUT) {
    return getSwapOutputAmount(xfai, tokenIn, tokenOut, amount);
  } else {
    return getSwapInputAmount(xfai, tokenIn, tokenOut, amount);
  }
}
