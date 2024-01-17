import { TokenInfo } from '@uniswap/token-lists';
import { getPoolNameForTokenAddress, getTokenDetails, Token } from '@xfai-labs/sdk';
import useXfaiQuery from '../meta/useXfaiQuery';
import { getAddress } from '@ethersproject/address';

export type useUnknownTokenResult = {
  exists: boolean;
  token:
    | ({
        hasPool: boolean;
      } & TokenInfo)
    | undefined;
  isLoading: boolean;
};
const useUnknownToken = (token: string | TokenInfo): useUnknownTokenResult => {
  const hasTokenDetails = typeof token !== 'string';

  const {
    data: tokenDetails,
    isError,
    isFetched,
    isLoading: isSymbolLoading,
  } = useXfaiQuery(
    ['tokenImport', token],
    (xfai) => getTokenDetails(xfai, Token(token as string)),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !hasTokenDetails,
    },
  );

  const {
    data: poolName,
    isSuccess: isPoolNameSuccess,
    isLoading: isPoolNameLoading,
  } = useXfaiQuery(
    ['token2poolName', token],
    (xfai) => getPoolNameForTokenAddress(xfai, hasTokenDetails ? token : Token(token)),
    {
      enabled: isFetched || hasTokenDetails,
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return {
    exists: !isError,
    token: tokenDetails
      ? {
          ...tokenDetails,
          address: getAddress(tokenDetails.address),
          hasPool: !!poolName && isPoolNameSuccess,
        }
      : hasTokenDetails
      ? {
          ...token,
          address: getAddress(token.address),
          hasPool: !!poolName && isPoolNameSuccess,
        }
      : undefined,
    isLoading: (isSymbolLoading && !hasTokenDetails) || isPoolNameLoading,
  };
};

export default useUnknownToken;
