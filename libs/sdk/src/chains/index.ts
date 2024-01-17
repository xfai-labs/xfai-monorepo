import { GANACHE_NETWORK } from './ganache';
import { LINEA_NETWORK } from './linea';
import { LINEA_GOERLI_NETWORK } from './linea-goerli';
export * from './core';
export const Mainnet = LINEA_NETWORK;
export const Chains = {
  [LINEA_NETWORK.chainId]: LINEA_NETWORK,
  [LINEA_GOERLI_NETWORK.chainId]: LINEA_GOERLI_NETWORK,
  [GANACHE_NETWORK.chainId]: GANACHE_NETWORK,
} as const;
export const SupportedChainIds = Object.values(Chains).map((chain) => chain.chainId);
export type SupportedChainIds = keyof typeof Chains;
