import { TokenList } from '@uniswap/token-lists';

const defaultTokenList: TokenList = {
  name: 'Xfai Ganache Token List',
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  logoURI: 'https://tokens.xfai.com/ethereum/0x4aa41bc1649c9c3177ed16caaa11482295fc7441.webp',
  timestamp: '',
  tokens: [
    {
      address: '0x008b9f730aab0d11bD7011ab89618b8858dE36Be',
      chainId: 5777,
      decimals: 6,
      name: 'DAI',
      symbol: 'DAI',
      logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    },
    {
      address: '0x4828169120e7b0f8336EaDFeEF8723B0Bc10e408',
      chainId: 5777,
      decimals: 6,
      name: 'Tether USD',
      symbol: 'USDT',
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    {
      address: '0x770472447723Aa56c756c9f7bb544916D56BAfe1',
      chainId: 5777,
      decimals: 8,
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
    },
    {
      address: '0xD059ABEacA504f2f644eEabA383961A958d73460',
      chainId: 5777,
      decimals: 18,
      name: 'Compound',
      symbol: 'COMP',
      logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png',
    },
    {
      address: '0x2ffd690c2f71E658D2f7e98863c3b473abdAf3d7',
      chainId: 5777,
      decimals: 18,
      name: 'Aave',
      symbol: 'AAVE',
      logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png',
    },
    {
      address: '0xBeA70d53a01A62332c7c39B2a77d4a0bf308d071',
      chainId: 5777,
      decimals: 18,
      name: 'Matic',
      symbol: 'MATIC',
      logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
    },
    {
      address: '0xb227d0d541428e4DE99440628b901119B859A21c',
      chainId: 5777,
      decimals: 18,
      name: 'Chainlink',
      symbol: 'LINK',
      logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png',
    },
  ],
};

export default defaultTokenList;
