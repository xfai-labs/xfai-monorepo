import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Chains } from '@xfai-labs/sdk';
const chain = Chains[1];
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
const provider = new StaticJsonRpcProvider(
  {
    url: chain.rpcUrl,
  },
  chain.chainId,
);

async function main() {
  const tokens = chain.defaultTokenList as DeepWriteable<typeof chain.defaultTokenList>;
  const tokensWithChainLink = [];
  for (const token of tokens.tokens) {
    const chainLinkAddress = await provider.resolveName(`${token.symbol}-ETH.data.eth`);
    if (chainLinkAddress) {
      token['extensions'] = {
        ...token.extensions,
        chainLinkAddress,
      };
      tokensWithChainLink.push(token);
    }
  }
  console.log(JSON.stringify(tokensWithChainLink));
}
main();
