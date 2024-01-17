import {
  BigNumber as EthersBigNumber,
  BigNumberish,
  ContractTransaction,
  PopulatedTransaction,
} from 'ethers';
import { PoolState } from './pool';
import { Xfai } from './xfai';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { getParsedEthersError, type EthersError } from '@enzoferey/ethers-error-parser';
import { ParsedEthersError } from './xfai-core';
import { BigNumber } from 'bignumber.js';

/**
 * A utility module for handling basis points and converting them to percentages.
 */

// The maximum basis point value (10000).
export const BASISPOINT_MAX: number = 1e4;

/**
 * Converts a basis point value to its equivalent percentage value.
 * @param value - The basis point value to be converted, as a BigNumber.
 * @returns The equivalent percentage value.
 */
export function basisPointToPercent(value: BigNumberish, decimals = 2) {
  return new BigNumber(value.toString()).times(1e2).div(BASISPOINT_MAX).toFixed(decimals);
}

/**
 * Converts percentage value to its a basis point value equivalent
 * @param value - The percentage value to be converted, as a BigNumber.
 * @returns The equivalent percentage value.
 */
export function percentToBasisPoint(value: number) {
  return validateBasisPoint((value * BASISPOINT_MAX) / 100);
}

/**
 * Validates a basis point value to ensure it falls within the acceptable range of 0 to 10000.
 * @param number - The basis point value to be validated, as a BigNumberish or a compatible numeric type.
 * @returns The valid basis point value if it falls within the acceptable range.
 * @throws An error if the provided basis point value is outside the valid range.
 */
export function validateBasisPoint(number: BigNumberish) {
  const basisPoint = EthersBigNumber.from(number);
  if (basisPoint.gte(0) && basisPoint.lte(BASISPOINT_MAX)) {
    return basisPoint;
  }
  throw new Error('Basis point value should be between 0 and 10000.');
}

/**
 * A utility module for working with permille values, which represent one-tenth of a percentage point.
 */
export const PERMILLE_MAX = 1e3;

/**
 * Validates a permille value to ensure it falls within the acceptable range of 0 to 1000.
 * @param number - The permille value to be validated, as a BigNumberish or a compatible numeric type.
 * @returns The valid permille value if it falls within the acceptable range.
 * @throws An error if the provided permille value is outside the valid range.
 */
export function validatePermille(number: BigNumberish) {
  const basisPoint = EthersBigNumber.from(number);
  if (basisPoint.gte(0) && basisPoint.lte(PERMILLE_MAX)) {
    return basisPoint;
  }
  throw new Error('Permille value should be between 0 and 1000.');
}

/**
 * Convert the date object to unix timestamp
 * @param param0
 * @returns unix timestamp
 */
export const calculateDeadline = ({ deadline }: { deadline: Date }): string => {
  return String(Math.floor(deadline.getTime() / 1000));
};
export const min = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.gt(b) ? b : a;
};

export const max = (a: BigNumber, b: BigNumber): BigNumber => {
  return a.gt(b) ? a : b;
};

/**
 * Return the amount out for a given xf In
 * @param pool
 * @param ethIn
 * @returns amountIn
 */
export const getSpotAmount = (pool: PoolState, ethIn: EthersBigNumber) => {
  if (pool.ethReserve.lte(0)) {
    throw new Error('Pool eth reserve needs to be greater than zero');
  }
  return ethIn.mul(pool.reserve).div(pool.ethReserve);
};

/**
 * Return the xf out for a given amount in
 * @param pool
 * @param amountIn
 * @returns xfOut
 */
export const getSpotEth = (pool: PoolState, amountIn: EthersBigNumber) => {
  return amountIn.mul(pool.ethReserve).div(pool.reserve);
};

/**
 * Returns the amount of token that's needed to get the desired eth reserve out
 * @param pool
 * @param ethOut
 * @returns amountIn
 */
export const getAdjustedAmountInput = (pool: PoolState, ethOut: EthersBigNumber) => {
  if (pool.ethReserve.lte(ethOut)) {
    const error = new Error('Pool eth reserve is less then eth reserve out');
    error.name = 'INSUFFICIENT_DEX_LIQUIDITY';
    throw error;
  }

  return ethOut.mul(pool.reserve).div(pool.ethReserve.sub(ethOut)).add(1);
};

/**
 * Returns the xf that's needed to get the desired token amount out
 * @param pool
 * @param amountOut
 * @returns xfIn
 */
export const getAdjustedEthInput = (pool: PoolState, amountOut: EthersBigNumber) => {
  if (pool.reserve.lte(amountOut)) {
    const error = new Error('Pool reserve is less then amount out');
    error.name = 'INSUFFICIENT_DEX_LIQUIDITY';
    throw error;
  }
  return amountOut.mul(pool.ethReserve).div(pool.reserve.sub(amountOut)).add(1);
};

/**
 * Returns the eth reserve out for the token amount in
 * @param pool
 * @param amountIn
 * @returns xfOut
 */
export const getAdjustedEthOutput = (pool: PoolState, amountIn: EthersBigNumber) => {
  return amountIn.mul(pool.ethReserve).div(pool.reserve.add(amountIn));
};

/**
 *
 * @param pool
 * @param amountIn
 * @returns amountOut
 */
export const getAdjustedAmountOutput = (pool: PoolState, ethIn: EthersBigNumber) => {
  return ethIn.mul(pool.reserve).div(pool.ethReserve.add(ethIn));
};
/**
 * Decreases the amount by the provided slippage (100 - 1% slippage) = (99)
 * @param amount
 * @param slippage
 * @returns amount with negative slippage
 */
export const negativeSlippage = (amount: EthersBigNumber, slippage: BigNumberish) => {
  const validatedSlippage = validateBasisPoint(slippage);
  return amount
    .mul(EthersBigNumber.from(BASISPOINT_MAX).sub(validatedSlippage))
    .div(BASISPOINT_MAX);
};
/**
 * Increases the amount by the provided slippage (100 + 1% slippage) = (101)
 * @param amount
 * @param slippage
 * @returns amount with positive slippage
 */
export const positiveSlippage = (amount: EthersBigNumber, slippage: BigNumberish) => {
  return amount.mul(EthersBigNumber.from(BASISPOINT_MAX).add(slippage)).div(BASISPOINT_MAX);
};

export function delayMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a populated transaction
 * @param xfai
 * @param populatedTx
 * @returns PopulatedTransaction
 */
export async function sendPopulatedTx(
  xfai: Xfai,
  populatedTx: Promise<PopulatedTransaction> | PopulatedTransaction,
): Promise<TransactionResponse> {
  const signer = await xfai.provider.getSigner();
  const pTx = await populatedTx;
  if (pTx && pTx.from !== (await signer.getAddress())) {
    throw new Error('Populated transaction is not from signer');
  }
  try {
    return await signer.sendTransaction(pTx);
  } catch (error) {
    const parsedEthersError = getParsedEthersError(error as EthersError);
    throw {
      type: 'ParsedEthersError',
      error,
      context: parsedEthersError,
    } as ParsedEthersError;
  }
}
/**
 * Tries to estimate the gas limit for a TransactionReceipt or ContractTransaction
 * @param tx TransactionReceipt | ContractTransaction
 * @returns BigNumber | undefined
 */
export function getTransactionGasCost(tx: TransactionReceipt | ContractTransaction) {
  if ('gasUsed' in tx) {
    if (!tx.effectiveGasPrice) return;
    return tx.gasUsed.mul(tx.effectiveGasPrice);
  }

  if (tx.gasPrice) {
    return tx.gasLimit.mul(tx.gasPrice);
  }

  if (tx.maxFeePerGas) {
    return tx.gasLimit.mul(tx.maxFeePerGas);
  }
  return;
}

export function calculatePriceImpact(input: EthersBigNumber, output: EthersBigNumber) {
  return new BigNumber(output.toString())
    .div(input.add(1).toString())
    .minus(1)
    .times(100) // percentage
    .toFixed(2);
}
