import { IAggregatorV3__factory, IERC20Metadata__factory } from '@xfai-labs/dex';
import { BigNumber, ethers, Wallet } from 'ethers';
import { multicall } from './multicall';
import { TokenInfo } from '@uniswap/token-lists';
import { Xfai, AddressType, Address, AccountAddress } from './xfai';
import { Pool } from './pool/core';
import { NATIVE_TOKEN_ADDRESS } from '../chains';

export type Token = Address<AddressType.Token> | Pick<TokenInfo, 'address' | 'decimals'>;

export const Token = (address: string): Token => Address(AddressType.Token, address);

export const isUnderlyingToken = (xfai: Xfai, token: Token) =>
  xfai.underlyingToken.address === token.address;

export const isWrappedNativeToken = (xfai: Xfai, token: Token | Pool | undefined) =>
  xfai.wrappedNativeToken.address === token?.address;

export const isSharedToken = (xfai: Xfai, token: Token | Pool | undefined) =>
  isWrappedNativeToken(xfai, token) || isNativeToken(token);

export const isNativeToken = (token: undefined | Token | Pool) =>
  NATIVE_TOKEN_ADDRESS.toLowerCase() === token?.address.toLowerCase();

export const getToken = (xfai: Xfai, token: Token | Pool) =>
  IERC20Metadata__factory.connect(handleNativeToken(xfai, token).address, xfai.provider);

export function getTokenBalance(
  xfai: Xfai,
  wallet: Wallet | AccountAddress,
  token: Token,
): Promise<BigNumber> {
  if (isNativeToken(token)) {
    return xfai.provider.getBalance(wallet.address);
  }
  return getToken(xfai, token).balanceOf(wallet.address);
}

export async function getTokenBalanceMulticall(
  xfai: Xfai,
  wallet: Wallet | { address: string },
  tokens: Token[],
): Promise<Record<Token['address'], BigNumber | undefined>> {
  const nonWeth = tokens.filter((t) => !isNativeToken(t));
  const nonWethBalances = multicall(
    xfai,
    IERC20Metadata__factory,
    nonWeth.map((token) => ({
      contractAddress: token.address,
      function_name: 'balanceOf',
      arguments: [wallet.address],
    })),
  );

  if (tokens.length === nonWeth.length) {
    return nonWethBalances;
  }

  const wethBalance = await xfai.provider.getBalance(wallet.address);
  return {
    [xfai.nativeToken.address]: wethBalance,
    ...((await nonWethBalances) as Record<Token['address'], BigNumber>),
  };
}

export const requestAllowance = async (xfai: Xfai, token: Token | Pool) =>
  getToken(xfai, token).populateTransaction.approve(
    xfai.peripheryAddress,
    ethers.constants.MaxUint256,
    {
      from: await xfai.provider.getSigner().getAddress(),
    },
  );

export const requestINFTAllowance = async (xfai: Xfai, token: Token | Pool) =>
  getToken(xfai, token).populateTransaction.approve(
    xfai.inftPeripheryAddress,
    ethers.constants.MaxUint256,
    {
      from: await xfai.provider.getSigner().getAddress(),
    },
  );

export function getPeripheryAllowance(
  xfai: Xfai,
  wallet: Wallet | AccountAddress,
  token: Token | Pool,
) {
  if (isNativeToken(token)) {
    return ethers.constants.MaxUint256;
  }
  return getToken(xfai, token).allowance(wallet.address, xfai.peripheryAddress);
}
export function getINFTPeripheryAllowance(
  xfai: Xfai,
  wallet: Wallet | AccountAddress,
  token: Token | Pool,
) {
  if (isNativeToken(token)) {
    return ethers.constants.MaxUint256;
  }
  return getToken(xfai, token).allowance(wallet.address, xfai.inftPeripheryAddress);
}

export async function getTokenDetails(xfai: Xfai, token: Token): Promise<TokenInfo> {
  const { name, symbol, decimals } = (await multicall(
    xfai,
    IERC20Metadata__factory,
    [
      {
        contractAddress: token.address,
        function_name: 'name',
        arguments: [],
      },
      {
        contractAddress: token.address,
        function_name: 'symbol',
        arguments: [],
      },
      {
        contractAddress: token.address,
        function_name: 'decimals',
        arguments: [],
      },
    ],
    {
      key: (args) => args['function_name'],
    },
  )) as {
    name: string;
    symbol: string;
    decimals: number;
  };
  return {
    name,
    address: token.address,
    symbol,
    decimals,
    chainId: xfai.chain.chainId,
  };
}

export function handleNativeToken(xfai: Xfai, token: Token | Pool): Token | Pool {
  if (isNativeToken(token)) {
    return xfai.wrappedNativeToken;
  }
  return token;
}

export async function getOraclePrice(xfai: Xfai, token: TokenInfo): Promise<BigNumber> {
  if (isWrappedNativeToken(xfai, handleNativeToken(xfai, token))) {
    return BigNumber.from(10).pow(18);
  }
  if (!token.extensions?.chainLinkOracleAddress) {
    throw new Error('Token does not have a Chain Link oracle address');
  }
  const { answer } = await IAggregatorV3__factory.connect(
    token.extensions.chainLinkOracleAddress as string,
    xfai.provider,
  ).callStatic.latestRoundData();
  return answer;
}
