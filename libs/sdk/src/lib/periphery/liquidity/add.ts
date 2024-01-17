import { BigNumber, PopulatedTransaction } from 'ethers';
import { Xfai } from '../../xfai';
import { calculateDeadline, negativeSlippage } from '../../xfai-utils';
import { deriveToAddress, getPeriphery, TransactionOptions } from '../core';
import { Token } from '../../xfai-token';

export type LiquidityInAmount<P extends Token = Token> = {
  token: P;
  amount: BigNumber;
};

/**
 * Add liquidity to a pool, in case you're providing single sided ETH, supplementary should be undefined
 */
export async function addLiquidity<P extends Token = Token>(
  xfai: Xfai,
  ethAmount: BigNumber,
  target: LiquidityInAmount<P>,
  options: TransactionOptions,
): Promise<PopulatedTransaction> {
  const periphery = getPeriphery(xfai, options.from);
  return periphery.populateTransaction.addLiquidity(
    await deriveToAddress(options),
    target.token.address,
    target.amount,
    negativeSlippage(target.amount, options.slippage),
    negativeSlippage(ethAmount, options.slippage),
    calculateDeadline(options),
    {
      value: ethAmount,
    },
  );
}
