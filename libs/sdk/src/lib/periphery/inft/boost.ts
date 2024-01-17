import { BigNumber, PopulatedTransaction } from 'ethers';
import { calculateDeadline } from '../../xfai-utils';
import { Xfai } from '../../xfai';
import { deriveToAddress, getINFTPeriphery, TransactionOptions } from '../core';
import { INFT } from '../../inft';

export type BoostOptions = Omit<TransactionOptions, 'slippage'>;

export const boostToken = async (
  xfai: Xfai,
  inft: INFT,
  amountIn: BigNumber,
  minShare: BigNumber,
  options: BoostOptions,
): Promise<PopulatedTransaction> =>
  getINFTPeriphery(xfai, options.from).populateTransaction.permanentBoosting(
    amountIn,
    minShare,
    inft.id,
    calculateDeadline(options),
    {
      from: await deriveToAddress(options),
    },
  );
