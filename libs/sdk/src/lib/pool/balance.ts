import { Xfai } from '../xfai';
import { BigNumber, Wallet } from 'ethers';
import { getToken, Token } from '../xfai-token';
import { getPool, getPoolFromToken } from './core';

export function getPoolBalance(
  xfai: Xfai,
  wallet: Wallet | { address: string },
  token: Token,
): Promise<BigNumber> {
  return getPool(xfai, getPoolFromToken(xfai, token)).balanceOf(wallet.address);
}

export function getPoolTokenBalance(xfai: Xfai, token: Token) {
  return getToken(xfai, token).balanceOf(getPoolFromToken(xfai, token).address);
}

export function getPoolSupply(xfai: Xfai, token: Token) {
  return getPool(xfai, getPoolFromToken(xfai, token)).totalSupply();
}
