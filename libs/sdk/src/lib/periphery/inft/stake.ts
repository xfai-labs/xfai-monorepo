import { BigNumber, PopulatedTransaction } from 'ethers';
import { calculateDeadline } from '../../xfai-utils';
import { Xfai } from '../../xfai';
import { deriveToAddress, getINFTPeriphery, TransactionOptions } from '../core';
import { INFT } from '../../inft';
import { boostToken } from './boost';

export type StakeOptions = Omit<TransactionOptions, 'slippage'>;

/**
 * Stake xfit to get an INFT.
 * If INFT is specified in options, the INFT will be boosted instead.
 * Takes a token and an amount in and min share out.
 */
export function stakeToken(
  xfai: Xfai,
  amountIn: BigNumber,
  minShare: BigNumber,
  options: StakeOptions & {
    inft: undefined | INFT;
  },
): Promise<PopulatedTransaction> {
  if (options.inft) {
    return boostToken(xfai, options.inft, amountIn, minShare, options);
  }

  return stakeERC20Token(xfai, amountIn, minShare, options);
}

async function stakeERC20Token(
  xfai: Xfai,
  amountIn: BigNumber,
  minShare: BigNumber,
  options: StakeOptions,
) {
  const periphery = getINFTPeriphery(xfai, options.from);
  return periphery.populateTransaction.permanentStaking(
    await deriveToAddress(options),
    amountIn,
    minShare,
    calculateDeadline(options),
  );
}
