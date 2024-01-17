import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Chains, SupportedChainIds, Xfai } from '@xfai-labs/sdk';
import TokensWithPools from './routes/getTokens';
import INFTFees from './routes/getINFTFees';
import INFTDetails from './routes/getINFTDetails';
import TokensTVL from './routes/getTokensTVL';

const routeMap = {
  '/pools': TokensWithPools,
  '/inftfees': INFTFees,
  '/inftdetails': INFTDetails,
  '/tvl': TokensTVL,
} as const;

const normalizePath = (path: string) => {
  // Remove the end slash and normalize the path
  const normalizedPath = path.replace(/\/$/, '').toLowerCase();
  return normalizedPath;
};

const getCacheKey = (request: Request) => {
  const requestUrl = new URL(request.url);
  requestUrl.pathname = normalizePath(requestUrl.pathname);
  if (requestUrl.pathname === '/inftdetails') {
    requestUrl.search = new URLSearchParams({
      inftId: requestUrl.searchParams.get('inftId') || '',
    }).toString();
  }

  if (requestUrl.pathname === '/inftfees') {
    requestUrl.search = new URLSearchParams({
      period: requestUrl.searchParams.get('period') || '',
    }).toString();
  }

  return new Request(requestUrl.toString());
};

const notFound = () => new Response('Not found', { status: 404 });

const fetch: ExportedHandlerFetchHandler<{
  CHAIN_ID: keyof typeof Chains;
}> = async (request, env, context) => {
  const chainId = Number(env.CHAIN_ID);
  if (!SupportedChainIds.includes(chainId)) {
    throw new Error('Chain not supported');
  }

  const chain = Chains[chainId as SupportedChainIds];

  const requestUrl = new URL(request.url);
  requestUrl.pathname = normalizePath(requestUrl.pathname);

  if (!(requestUrl.pathname in routeMap)) {
    return notFound();
  }

  // Construct the cache key from the cache URL
  const cacheKey = getCacheKey(request);
  const cache = await caches.default;

  let response = await cache.match(cacheKey);

  if (!response) {
    const provider = new StaticJsonRpcProvider({
      url: chain.rpcUrl,
      skipFetchSetup: true,
    });
    const xfai = new Xfai(provider, chain);

    await provider.ready;
    const routeResponse = await routeMap[requestUrl.pathname as keyof typeof routeMap](
      xfai,
      request,
    );
    if (!routeResponse) {
      return notFound();
    }

    const { content, cacheTime } = routeResponse;

    response = new Response(JSON.stringify(content), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, maxage=${cacheTime}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
};

export default {
  fetch,
};
