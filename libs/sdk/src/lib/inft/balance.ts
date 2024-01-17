import { INFT, getINFT } from './core';
import { AccountAddress, Xfai } from '../xfai';
import { multicall } from '../multicall';
import { Token, handleNativeToken } from '../xfai-token';
import { BigNumber } from 'ethers';
import { IXfaiINFT__factory } from '@xfai-labs/dex';

export type INFTBalance = {
  amount: BigNumber;
  totalShares: BigNumber;
  harvestedShares: BigNumber;
};

export async function getINFTBalance(xfai: Xfai, account: AccountAddress): Promise<number> {
  return (await getINFT(xfai).balanceOf(account.address)).toNumber();
}

export async function getINFTTokenBalance(
  xfai: Xfai,
  inft: INFT,
  token: Token,
): Promise<INFTBalance> {
  const [amount, totalShares, harvestedShares] = await getINFT(xfai).shareToTokenAmount(
    inft.id,
    handleNativeToken(xfai, token).address,
  );

  return { amount, totalShares, harvestedShares };
}

export async function getINFTTokenBalanceMulticall<T extends boolean>(
  xfai: Xfai,
  inft: INFT,
  tokens: Token[],
  allowFailure: T,
): Promise<Record<Token['address'], T extends true ? undefined | INFTBalance : INFTBalance>> {
  const balances = await multicall(
    xfai,
    IXfaiINFT__factory,
    tokens.map((token) => ({
      function_name: 'shareToTokenAmount',
      contractAddress: xfai.inftAddress,
      arguments: [inft.id, handleNativeToken(xfai, token).address] as [number, string],
    })),
    {
      key: async (arg, i) => tokens[i].address,
      allowFailure,
    },
  );

  return Object.fromEntries(
    Object.entries(balances).map(([inftId, inft]) => {
      if (!inft) return [inftId, undefined];
      const [amount, totalShares, harvestedShares] = inft;
      return [
        inftId,
        {
          amount,
          totalShares,
          harvestedShares,
        },
      ];
    }),
  ) as Record<Token['address'], T extends true ? undefined | INFTBalance : INFTBalance>;
}

export async function getINFTsForOwner(xfai: Xfai, owner: AccountAddress, balance: number) {
  const indexes = Array.from(Array(balance).keys());
  return multicall(
    xfai,
    IXfaiINFT__factory,
    indexes.map((i) => ({
      function_name: 'tokenOfOwnerByIndex',
      contractAddress: xfai.inftAddress,
      arguments: [owner.address, i],
    })),
    {
      key: (arg) => Number(arg.arguments[1].toString()),
      allowFailure: false,
    },
  );
}
