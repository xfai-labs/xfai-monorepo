import { Chain } from '../../lib/xfai';
import defaultTokenList from './tokenLists/default';

export const LINEA_GOERLI_NETWORK: Chain<59140> = {
  chainId: 59140,
  development: true,
  label: 'Linea Goerli',
  logoUri: 'https://assets.xfai.com/linea.png',
  etherscanApi: 'https://api-goerli-linea.etherscan.io/',
  nativeToken: {
    name: 'Linea Goerli Ether',
    symbol: 'gETH',
    decimals: 18,
    logoURI: 'https://assets.xfai.com/linea.png',
  },
  wrappedNativeToken: {
    name: 'Wrapped Linea Goerli Ether',
    symbol: 'wlgETH',
    decimals: 18,
    address: '0x2c1b868d6596a18e32e61b901e4060c872647b6c',
    logoURI: 'https://assets.xfai.com/linea.png',
  },
  defaultTokenList: defaultTokenList,
  blockExplorerUrl: 'https://goerli.lineascan.build/',
  backendApi: 'https://liea-goerli.backend.xfai.com',
  rpcUrl: '	https://rpc.goerli.linea.build',
  addresses: {
    token_usdc: '0x3866E62253a05F108A2dEc6540Cd40C74b92d489',
    underlying_token: '0xe9e4c0070DD7401C6567ac0518b611f899d9549A',
    inft: '0xc6f4C93D432618d7577d721FD2809340f9e24E97',
    inft_periphery: '0x7B7c6bae1765f2615160a12e56d41fa41f3FC739',
    core: '0x12718636Bea4E6345eE25D8B4f4b8b47d92E22ef',
    periphery: '0xf4E2a7C4Ec75cb8002ad8eb45b6ca122FFe35e78',
    factory: '0x4443C60CA0f8190DD1fE5b1Eb94DF6Fa9F329eCc',
    multicall: '0xb227d0d541428e4DE99440628b901119B859A21c',
    pool_hash: '0xd29425d309539268aa2f934062f86ea332822e787dafc6baba7cfda029630330',
  },
} as const;
