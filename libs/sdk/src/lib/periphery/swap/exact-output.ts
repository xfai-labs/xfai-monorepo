import { Xfai } from '../../xfai';
import { positiveSlippage, calculateDeadline } from '../../xfai-utils';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { Token, isNativeToken } from '../../xfai-token';
import { deriveToAddress, getPeriphery, TransactionOptions } from '../core';

export async function swapTokensExactOutput(
  xfai: Xfai,
  tokenIn: Token,
  tokenOut: Token,
  amountIn: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions,
): Promise<PopulatedTransaction> {
  const maxAmountIn = positiveSlippage(amountIn, options.slippage);
  if (isNativeToken(tokenIn)) {
    return swapEthToExactToken(xfai, tokenOut, maxAmountIn, amountOut, options);
  }
  if (isNativeToken(tokenOut)) {
    return swapTokenToExactEth(xfai, tokenIn, maxAmountIn, amountOut, options);
  }

  return swapTokenToExactToken(xfai, tokenIn, tokenOut, maxAmountIn, amountOut, options);
}

const swapTokenToExactToken = async (
  xfai: Xfai,
  tokenIn: Token,
  tokenOut: Token,
  maxAmountIn: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions,
) => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapTokensForExactTokens(
    await deriveToAddress(options),
    tokenIn.address,
    tokenOut.address,
    amountOut,
    maxAmountIn,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
    },
  );

  return tx;
};

const swapEthToExactToken = async (
  xfai: Xfai,
  tokenOut: Token,
  maxEthInAmount: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions,
) => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapETHForExactTokens(
    await deriveToAddress(options),
    tokenOut.address,
    amountOut,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
      value: maxEthInAmount,
    },
  );

  return tx;
};

const swapTokenToExactEth = async (
  xfai: Xfai,
  tokenIn: Token,
  maxAmountIn: BigNumber,
  ethOut: BigNumber,
  options: TransactionOptions,
) => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapExactTokensForETH(
    await deriveToAddress(options),
    tokenIn.address,
    ethOut,
    maxAmountIn,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
    },
  );

  return tx;
};
