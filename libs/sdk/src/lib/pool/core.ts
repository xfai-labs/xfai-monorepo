import { getCreate2Address } from '@ethersproject/address';
import { keccak256, pack } from '@ethersproject/solidity';
import { BigNumber, CallOverrides } from 'ethers';
import { Xfai, Address, AddressType } from '../xfai';
import { handleNativeToken, Token } from '../xfai-token';
import { PERMILLE_MAX, validatePermille } from '../xfai-utils';
import { multicall } from '../multicall';
import { IXfaiPool__factory } from '@xfai-labs/dex';

export type Pool = Address<AddressType.Pool>;
export const Pool = (address: string): Pool => Address(AddressType.Pool, address);

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export type PoolState = {
  reserve: BigNumber;
  ethReserve: BigNumber;
};

export function getPool(xfai: Xfai, pool: Pool) {
  return IXfaiPool__factory.connect(pool.address, xfai.provider);
}

export function getPoolFromTokenAddress(xfai: Xfai, token: Token) {
  return getPool(xfai, getPoolFromToken(xfai, token));
}

export function getPoolNameForTokenAddress(xfai: Xfai, token: Token): Promise<string> {
  return getPool(xfai, getPoolFromToken(xfai, token)).name();
}

export function getPoolFromToken(xfai: Xfai, token: Token): Pool {
  return Pool(
    getCreate2Address(
      xfai.factoryAddress,
      keccak256(['bytes'], [pack(['address'], [handleNativeToken(xfai, token).address])]),
      xfai.poolInitCodeHash,
    ),
  );
}

export async function getPoolState(xfai: Xfai, pool: Pool, options: CallOverrides = {}) {
  const [reserve, ethReserve] = await getPool(xfai, pool).getStates(options);
  return {
    reserve,
    ethReserve,
  } as PoolState;
}

export async function getPoolStateMulticall(xfai: Xfai, poolsOrTokens: Token[] | Pool[]) {
  const states = await multicall(
    xfai,
    IXfaiPool__factory,
    poolsOrTokens.map((poolOrToken) => ({
      function_name: 'getStates',
      contractAddress:
        (poolOrToken as unknown as Address<AddressType>).type === AddressType.Pool
          ? poolOrToken.address
          : getPoolFromToken(xfai, poolOrToken as Token).address,
      arguments: [],
    })),
    {
      allowFailure: false,
      key: (_, index) => poolsOrTokens[index].address,
    },
  );

  return Object.fromEntries(
    Object.entries(states).map(([address, state]) => [
      address,
      {
        reserve: state[0],
        ethReserve: state[1],
      } as PoolState,
    ]),
  );
}

export const calculateSwapFee = (xfai: Xfai | number, amount: BigNumber): BigNumber => {
  return amount
    .mul(validatePermille(typeof xfai === 'number' ? xfai : xfai.swapFee))
    .div(PERMILLE_MAX);
};

export const subtractSwapFee = (xfai: Xfai | number, amount: BigNumber): BigNumber => {
  return amount.sub(calculateSwapFee(xfai, amount));
};
export const addSwapFee = (xfai: Xfai | number, amount: BigNumber): BigNumber => {
  return amount
    .mul(PERMILLE_MAX)
    .div(
      BigNumber.from(PERMILLE_MAX).sub(
        validatePermille(typeof xfai === 'number' ? xfai : xfai.swapFee),
      ),
    );
};
