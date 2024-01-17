import { Chain } from '../../lib/xfai';
import { NATIVE_TOKEN_ADDRESS } from '../core';
import defaultTokenList from './tokenLists/default';

export const LINEA_NETWORK: Chain<59144> = {
  chainId: 59144,
  development: false,
  label: 'Linea',
  logoUri: 'https://assets.xfai.com/linea.png',
  nativeToken: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://tokens.xfai.com/ethereum/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.webp',
  },
  wrappedNativeToken: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    logoURI: 'https://tokens.xfai.com/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.webp',
  },
  defaultTokenList: defaultTokenList,
  topTokenAddresses: [
    NATIVE_TOKEN_ADDRESS,
    '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    '0x8C56017B172226fE024dEa197748FC1eaccC82B1',
    '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4',
  ],
  blockExplorerUrl: 'https://explorer.linea.build',
  backendApi: 'https://linea.backend.xfai.com',
  rpcUrl: 'https://rpc.linea.build',
  addresses: {
    token_usdc: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    underlying_token: '0x8C56017B172226fE024dEa197748FC1eaccC82B1',
    inft: '0xa155f12D3Be29BF20b615e1e7F066aE9E3C5239a',
    inft_periphery: '0x91612287fd53bEDD253a89e3d9813423ea20AAEC',
    core: '0x8D58ee2D23f7920eA32e534aAD8d6753c88bc01A',
    // periphery: '0x2205ebb740c7c98eD52cf7F0FC302EB8a4afD5a4',
    periphery: '0xD538be6e9026C13D130C9e17d509E69C8Bb0eF33',
    factory: '0xa5136eAd459F0E61C99Cec70fe8F5C24cF3ecA26',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    pool_hash: '0xd29425d309539268aa2f934062f86ea332822e787dafc6baba7cfda029630330',
  },
} as const;
