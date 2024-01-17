import { Xfai, getPoolFromToken, multicall } from '@xfai-labs/sdk';
import { getTokens } from './getTokens';
import { IERC20Metadata__factory } from '@xfai-labs/dex';
import { BigNumber } from 'ethers';

export async function getTokensTVL(xfai: Xfai) {
  const tokens = await getTokens(xfai);

  const tokenPoolPairs = tokens.map((t) => [t.address, getPoolFromToken(xfai, t).address]);

  const tokenTVL = await multicall(
    xfai,
    IERC20Metadata__factory,
    tokenPoolPairs.map(([_, pool]) => ({
      arguments: [pool],
      contractAddress: xfai.wrappedNativeToken.address,
      function_name: 'balanceOf',
    })),
    {
      key: (arg, i) => tokenPoolPairs[i][0],
    },
  );

  return Object.fromEntries(
    Object.entries(tokenTVL)
      .filter(([_, tvl]) => Boolean(tvl))
      .sort(([_a, a], [_b, b]) => a!.sub(b!).div(BigNumber.from(10).pow(17)).toNumber())
      .reverse() // Descending order
      .map(([t, tvl]) => [t, tvl!.div(BigNumber.from(10).pow(17)).toNumber()]),
  );
}

const RequestHandler: RouteHandler = async (xfai: Xfai) => {
  return {
    content: await getTokensTVL(xfai),
    cacheTime: 60 * 60 * 24,
  };
};

export default RequestHandler;
