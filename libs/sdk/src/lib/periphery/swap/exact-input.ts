import { Xfai } from '../../xfai';
import { calculateDeadline, negativeSlippage } from '../../xfai-utils';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { Token, isNativeToken } from '../../xfai-token';
import { deriveToAddress, getPeriphery, TransactionOptions } from '../core';

export async function swapTokensExactInput(
  xfai: Xfai,
  tokenIn: Token,
  tokenOut: Token,
  amountIn: BigNumber,
  amountOut: BigNumber,
  options: TransactionOptions | TransactionOptions,
): Promise<PopulatedTransaction> {
  const minAmountOut = negativeSlippage(amountOut, options.slippage);
  if (isNativeToken(tokenIn)) {
    return swapExactEthToToken(
      xfai,
      amountIn,
      tokenOut,
      minAmountOut,
      options as TransactionOptions,
    );
  }
  if (isNativeToken(tokenOut)) {
    return swapExactTokenToEth(
      xfai,
      tokenIn,
      amountIn,
      minAmountOut,
      options as TransactionOptions,
    );
  }

  return swapExactTokenToToken(
    xfai,
    tokenIn,
    tokenOut,
    amountIn,
    minAmountOut,
    options as TransactionOptions,
  );
}

const swapExactTokenToToken = async (
  xfai: Xfai,
  tokenIn: Token,
  tokenOut: Token,
  tokenInAmount: BigNumber,
  minTokenOutAmount: BigNumber,
  options: TransactionOptions,
): Promise<PopulatedTransaction> => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapExactTokensForTokens(
    await deriveToAddress(options),
    tokenIn.address,
    tokenOut.address,
    tokenInAmount,
    minTokenOutAmount,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
    },
  );

  return tx;
};

const swapExactEthToToken = async (
  xfai: Xfai,
  ethInAmount: BigNumber,
  tokenOut: Token,
  minTokenOutAmount: BigNumber,
  options: TransactionOptions,
) => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapExactETHForTokens(
    await deriveToAddress(options),
    tokenOut.address,
    minTokenOutAmount,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
      value: ethInAmount,
    },
  );

  return tx;
};

export const swapExactTokenToEth = async (
  xfai: Xfai,
  tokenIn: Token,
  tokenInAmount: BigNumber,
  minEthOutAmount: BigNumber,
  options: TransactionOptions,
) => {
  const periphery = getPeriphery(xfai, options.from);
  const tx = await periphery.populateTransaction.swapExactTokensForETH(
    await deriveToAddress(options),
    tokenIn.address,
    tokenInAmount,
    minEthOutAmount,
    calculateDeadline(options),
    {
      gasLimit: options.gasLimit,
    },
  );

  return tx;
};
