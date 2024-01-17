import { IWETH__factory } from '@xfai-labs/dex';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { Xfai } from '../../xfai';
import { TransactionOptions, deriveToAddress } from '../core';

/**
 * Wrap ETH to WETH
 */
export async function swapEthToWeth(
  xfai: Xfai,
  amountIn: BigNumber,
  options: Pick<TransactionOptions, 'from'>,
): Promise<PopulatedTransaction> {
  return IWETH__factory.connect(
    xfai.wrappedNativeToken.address,
    xfai.provider,
  ).populateTransaction.deposit({
    value: amountIn,
    from: await deriveToAddress(options),
  });
}

/**
 * Unwrap WETH to ETH
 */
export async function swapWethToEth(
  xfai: Xfai,
  amountIn: BigNumber,
  options: Pick<TransactionOptions, 'from'>,
) {
  return IWETH__factory.connect(
    xfai.wrappedNativeToken.address,
    xfai.provider,
  ).populateTransaction.withdraw(amountIn, {
    from: await deriveToAddress(options),
  });
}
