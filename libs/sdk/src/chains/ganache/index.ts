import { Chain } from '../../lib/xfai';
import defaultTokenList from './tokenLists/default';

export const GANACHE_NETWORK: Chain<5777> = {
  label: 'Ganache',
  development: true,
  chainId: 5777,
  logoUri:
    'https://raw.githubusercontent.com/trufflesuite/ganache-ui/develop/static/icons/png/128x128.png',
  nativeToken: {
    name: 'Ganache Ether',
    symbol: 'GETH',
    decimals: 18,
  },
  wrappedNativeToken: {
    name: 'Wrapped Ganache Ether',
    symbol: 'WGETH',
    decimals: 18,
    address: '0xA137EC3aB95e53e3564809661C169d7320b3211C',
  },
  defaultTokenList: defaultTokenList,
  rpcUrl: 'http://localhost:8545',
  backendApi: 'https://goerli-backend.xfai.workers.dev',
  addresses: {
    token_usdc: '0x95a7e5dcE08Afb07F0bA46DA25A989AC7D73b490',
    underlying_token: '0x3866E62253a05F108A2dEc6540Cd40C74b92d489',
    inft: '0x4EBbf2dC2579e6148bEC236e72E5ef2c010dc235',
    core: '0x4443C60CA0f8190DD1fE5b1Eb94DF6Fa9F329eCc',
    periphery: '0xC48734D8e96a39f102faC5E5A3034AECA060e523',
    inft_periphery: '0x12718636Bea4E6345eE25D8B4f4b8b47d92E22ef',
    factory: '0x4EBbf2dC2579e6148bEC236e72E5ef2c010dc235',
    multicall: '0x7dE2961A2766721664Dd23616226e97C15454044',
    pool_hash: '0x80c76def6eb52925efceaf7c17665f74777c4c0cf14069aae58950ccb36683cc',
  },
} as const;
