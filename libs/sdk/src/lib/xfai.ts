import type { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { TokenInfo, TokenList } from '@uniswap/token-lists';
import { NATIVE_TOKEN_ADDRESS } from '../chains';
import { validatePermille } from './xfai-utils';
import { BigNumberish } from 'ethers';
export type Chain<T extends number = number> = {
  readonly development: boolean;
  readonly chainId: T;
  readonly label: string;
  readonly logoUri: string;
  readonly nativeToken: Omit<TokenInfo, 'chainId' | 'address'>;
  readonly wrappedNativeToken: Omit<TokenInfo, 'chainId'>;
  readonly defaultTokenList: TokenList;
  readonly blockExplorerUrl?: string;
  readonly etherscanApi?: string;
  readonly backendApi?: string;
  readonly rpcUrl: string;
  readonly cloudflareApiKey?: string;
  readonly topTokenAddresses?: readonly string[];
  readonly addresses: {
    underlying_token: string;
    token_usdc?: string;
    core: string;
    factory: string;
    periphery: string;
    inft_periphery: string;
    multicall: string;
    pool_hash: string;
    inft: string;
  };
};

export enum AddressType {
  Token = 'token',
  Pool = 'pool',
  Account = 'account',
  INFT = 'inft',
}
export type Address<T extends AddressType> = {
  type: T;
  address: string;
};
export const Address = <T extends AddressType>(type: T, address: string): Address<T> => ({
  type,
  address,
});

export type AccountAddress = Address<AddressType.Account>;
export const AccountAddress = (address: string): AccountAddress =>
  Address(AddressType.Account, address);
/**
 * This class contains all the information needed to interact with the Xfai protocol.
 * The provider parameter is used to interact with the Ethereum network using ethers.js.
 */
export class Xfai {
  public readonly nativeToken: TokenInfo;
  public readonly swapFee: BigNumberish;
  public readonly wrappedNativeToken: TokenInfo;
  public readonly underlyingToken: TokenInfo;
  public readonly usdc: TokenInfo | undefined;
  public readonly topTokenAddresses: string[] = [];
  public readonly coreAddress: string;
  public readonly factoryAddress: string;
  public readonly multicallAddress: string;
  public readonly inftAddress: string;
  public readonly peripheryAddress: string;
  public readonly inftPeripheryAddress: string;
  public readonly poolInitCodeHash: string;
  public readonly hasWallet: boolean;

  /**
   * @param provider The provider to use for interacting with the Ethereum network.
   * @param chain The chain config to use for interacting with the network.
   * @param swapFee The swap fee
   */
  constructor(
    public readonly provider: (StaticJsonRpcProvider & { _hasWallet?: false }) | Web3Provider,
    public chain: Chain,
    swapFee = 2,
  ) {
    this.swapFee = validatePermille(swapFee);
    this.nativeToken = {
      ...chain.nativeToken,
      address: NATIVE_TOKEN_ADDRESS,
      chainId: chain.chainId,
    };
    this.wrappedNativeToken = {
      ...chain.wrappedNativeToken,
      chainId: chain.chainId,
    };
    this.underlyingToken = {
      address: chain.addresses.underlying_token,
      chainId: chain.chainId,
      name: 'Xfai',
      decimals: 18,
      symbol: 'XFIT',
      logoURI: 'https://tokens.xfai.com/ethereum/0x4aa41bc1649c9c3177ed16caaa11482295fc7441.webp',
    };
    if (chain.addresses.token_usdc) {
      this.usdc = {
        address: chain.addresses.token_usdc,
        chainId: chain.chainId,
        name: 'USD Coin',
        decimals: 6,
        symbol: 'USDC',
        logoURI: 'https://tokens.xfai.com/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.webp',
        extensions: {
          chainLinkOracleAddress:
            chain.chainId === 1 ? '0x986b5e1e1755e3c2440e960477f25201b0a8bbd4' : undefined,
        },
      };
    }

    this.multicallAddress = chain.addresses.multicall;
    this.factoryAddress = chain.addresses.factory;
    this.coreAddress = chain.addresses.core;
    this.inftAddress = chain.addresses.inft;
    this.peripheryAddress = chain.addresses.periphery;
    this.inftPeripheryAddress = chain.addresses.inft_periphery;
    this.poolInitCodeHash = chain.addresses.pool_hash;
    this.topTokenAddresses = [...(chain.topTokenAddresses ?? [])];
    this.hasWallet = (provider as unknown as any)._hasWallet ?? true;
  }
}
