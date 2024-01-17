import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Chains, Xfai, getTokenDetails, Token, delayMs, Mainnet } from '@xfai-labs/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const chain = Mainnet;

const provider = new StaticJsonRpcProvider(
  {
    url: chain.rpcUrl,
  },
  chain.chainId,
);

const xfai = new Xfai(provider, chain);

(async function () {
  const tokenAddresses = readFileSync(join(__dirname, 'assets/ethereum_seed_pools.csv'), 'utf8')
    .split('\n')
    .slice(1)
    .map((row) => row.split(','))
    .map((cols) => cols[2].trim());
  const tokenList = [];
  for await (const tokenAddress of tokenAddresses) {
    const token = await getTokenDetails(xfai, Token(tokenAddress));
    tokenList.push(token);
    delayMs(100);
    console.log('token', token.address, token.symbol, token.name, token.decimals);
  }
  writeFileSync(
    join(__dirname, 'assets/ethereum_seed_pools.json'),
    JSON.stringify(tokenList, null, 2),
    'utf8',
  );
  process.exit();
})();
