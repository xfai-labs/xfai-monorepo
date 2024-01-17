import type { TokenInfo } from '@uniswap/token-lists';
import { BigNumber, ethers } from 'ethers';

type Token = (Partial<TokenInfo> & Pick<TokenInfo, 'decimals'>) | 'fiat' | 'gwei' | 'eth' | 'xfit';

type Options = {
  roundingMode?: 'up' | 'down';
  precision?: number;
  prefix?: string;
  keepSmall?: boolean;
  symbol?: true;
};

export function toggleAmount<A extends string | BigNumber | undefined, T extends Token | undefined>(
  amount: A,
  token: T,
  options?: Options,
): T extends undefined
  ? undefined
  : A extends undefined
  ? undefined
  : A extends string
  ? BigNumber
  : string;
export function toggleAmount<A extends string | undefined>(
  amount: A,
  token: Token,
  options?: Options,
): A extends undefined ? undefined : BigNumber;
export function toggleAmount<A extends BigNumber | undefined>(
  amount: A,
  token: Token,
  options?: Options,
): A extends undefined ? undefined : string;
export function toggleAmount<A extends string | BigNumber | undefined, T extends Token | undefined>(
  amount: A,
  token: T,
  options?: Options,
) {
  const { prefix = '', keepSmall = false, roundingMode, symbol } = options || {};
  let { precision = 6 } = options || {};
  let suffix = '';

  if (token === undefined) {
    return undefined;
  }

  if (symbol) {
    suffix =
      token === 'xfit'
        ? 'XFIT'
        : token === 'fiat'
        ? ' USDC'
        : token === 'gwei'
        ? ' GWEI'
        : token === 'eth'
        ? ' ETH'
        : ` ${token.symbol}` ?? '';
  }

  if (token === 'fiat') {
    // we want only 2 decimals for usdc
    precision = 2;
  }

  if (typeof amount === 'undefined') {
    return undefined;
  }

  if (typeof amount === 'string' && (amount === '0' || amount.trim() === '.')) {
    return BigNumber.from(0);
  }

  if (typeof amount === 'object' && amount.isZero()) {
    return `${prefix}0${suffix}`;
  }

  const decimals =
    token === 'xfit'
      ? 18
      : token === 'fiat'
      ? 6
      : token === 'gwei'
      ? 18
      : token === 'eth'
      ? 18
      : token.decimals;

  if (typeof amount === 'string') {
    if (amount.match(/</)) {
      return BigNumber.from(0);
    }
    if (amount.includes('.')) {
      const [whole, decimal] = amount.split('.', 2);
      return ethers.utils.parseUnits(`${whole}.${decimal.substring(0, decimals)}`, decimals);
    }

    return ethers.utils.parseUnits(amount, decimals);
  }

  const power = BigNumber.from(10).pow(Math.max(decimals - precision, 0));

  if (amount.isZero()) {
    return `${prefix}0.00${suffix}`;
  }

  if (amount.lt(power)) {
    if (keepSmall) {
      return ethers.utils.formatUnits(amount, decimals);
    }
    return `${prefix}<0.${'0'.repeat(Math.min(decimals, precision))}1${suffix}`;
  }
  return (
    prefix +
    ethers.utils.formatUnits(
      amount
        .div(power)
        .add(roundingMode === 'up' ? 1 : roundingMode === 'down' ? -1 : 0)
        .mul(power),
      decimals,
    ) +
    suffix
  );
}
