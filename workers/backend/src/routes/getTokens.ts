import { IXfaiFactory__factory, IXfaiPool__factory } from '@xfai-labs/dex';
import { Token, Xfai, multicall } from '@xfai-labs/sdk';

export async function getTokens(xfai: Xfai) {
  const factory = IXfaiFactory__factory.connect(xfai.factoryAddress, xfai.provider);
  const noOfPools = await factory.allPoolsLength();

  const callArgs = [...new Array(noOfPools.toNumber())].map(
    (_, index) =>
      ({
        arguments: [index],
        function_name: 'allPools',
        contractAddress: xfai.factoryAddress,
      }) as const,
  );

  const pools = await multicall(xfai, IXfaiFactory__factory, callArgs, {
    key: (_, index) => index,
    allowFailure: false,
  });

  const tokens = await multicall(
    xfai,
    IXfaiPool__factory,
    Object.values(pools).map((pool) => ({
      arguments: [] as never,
      contractAddress: pool,
      function_name: 'poolToken',
    })),
    {
      allowFailure: false,
    },
  );

  return Object.values(tokens).map((t) => Token(t));
}

const RequestHandler: RouteHandler = async (xfai: Xfai) => {
  return {
    content: (await getTokens(xfai)).map((t) => t.address),
    cacheTime: 60 * 60 * 24,
  };
};

export default RequestHandler;
