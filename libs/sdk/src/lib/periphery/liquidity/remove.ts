import { BigNumber, PopulatedTransaction } from 'ethers';
import { Xfai } from '../../xfai';
import { Token, handleNativeToken, isSharedToken } from '../../xfai-token';
import { calculateDeadline, negativeSlippage } from '../../xfai-utils';
import { deriveToAddress, getPeriphery, TransactionOptions } from '../core';

export type TargetTokenAmount = {
  token: Token;
  desiredAmount: BigNumber;
};
/**
 * Remove liquidity from a pool,
 */
export async function removeLiquidity(
  xfai: Xfai,
  lpTokenAmount: BigNumber,
  target: TargetTokenAmount,
  supplementary: TargetTokenAmount,
  options: TransactionOptions,
): Promise<PopulatedTransaction> {
  if (isSharedToken(xfai, target.token)) {
    throw new Error('Target token cannot be ETH/WETH');
  }
  const periphery = getPeriphery(xfai, options.from);
  const supplementaryToken = handleNativeToken(xfai, supplementary.token);
  return periphery.populateTransaction.removeLiquidity(
    await deriveToAddress(options),
    target.token.address,
    supplementaryToken.address,
    lpTokenAmount,
    negativeSlippage(target.desiredAmount, options.slippage),
    negativeSlippage(supplementary.desiredAmount, options.slippage),
    calculateDeadline(options),
  );
}
