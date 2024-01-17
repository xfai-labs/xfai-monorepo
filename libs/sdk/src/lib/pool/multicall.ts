import { IXfaiPool__factory } from '@xfai-labs/dex';
import { BigNumber, Wallet } from 'ethers';
import { multicall } from '../multicall';
import { Xfai } from '../xfai';
import { Token, handleNativeToken } from '../xfai-token';
import { getPoolFromToken } from './core';

export function getPoolBalanceMulticall(
  xfai: Xfai,
  wallet: Wallet | { address: string },
  tokens: Token[],
): Promise<Record<string, BigNumber | undefined>> {
  return multicall(
    xfai,
    IXfaiPool__factory,
    tokens.map((token) => ({
      contractAddress: getPoolFromToken(xfai, token).address,
      arguments: [wallet.address],
      function_name: 'balanceOf',
    })),
    {
      key: (_, index) => tokens[index].address,
    },
  );
}

export function getPoolTokenBalanceMulticall(xfai: Xfai, tokens: Token[]) {
  return multicall(
    xfai,
    IXfaiPool__factory,
    tokens.map((token) => ({
      contractAddress: handleNativeToken(xfai, token).address,
      arguments: [getPoolFromToken(xfai, Token(token.address)).address],
      function_name: 'balanceOf',
    })),
    {
      key: (_, index) => tokens[index].address,
    },
  );
}

export function getPoolLiquidityMulticall(xfai: Xfai, tokens: Token[]) {
  return multicall(
    xfai,
    IXfaiPool__factory,
    tokens.map((token) => ({
      contractAddress: getPoolFromToken(xfai, token).address,
      function_name: 'totalSupply',
      arguments: [],
    })),
    {
      key: (_, index) => tokens[index].address,
    },
  );
}
