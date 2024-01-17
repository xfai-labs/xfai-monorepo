import { BigNumber } from 'ethers';
import { PoolState } from './core';
import { getSpotAmount, getSpotEth } from '../xfai-utils';
import { Token } from '../xfai-token';

export type QuoteBase = 'ETH' | 'Token';

export type QuoteResult<T extends QuoteBase> = T extends 'Token'
  ? {
      ethIn?: BigNumber;
      tokenIn: BigNumber | undefined;
      xfAmount?: BigNumber;
    }
  : {
      ethIn: BigNumber | undefined;
      tokenIn?: BigNumber;
      xfAmount?: BigNumber;
    };

export type Quote<T extends QuoteBase> = {
  type: T;
  token: {
    state: PoolState;
    token: Token;
  };
  amount: BigNumber;
};

export function quote<T extends QuoteBase>({ type, token, amount }: Quote<T>): QuoteResult<T> {
  if (type === 'ETH') {
    const ethAmount = amount;
    return {
      ethIn: amount,
      tokenIn: getSpotAmount(token.state, ethAmount),
    };
  }
  const ethIn = getSpotEth(token.state, amount);
  return {
    ethIn,
    tokenIn: amount,
  };
}
