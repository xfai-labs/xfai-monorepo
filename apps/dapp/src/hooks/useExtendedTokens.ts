import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';
import { TokenList } from '@uniswap/token-lists';
import useChain from './chain/useChain';

const useExtendedTokens = () => {
  const [extendedTokens, setExtendedTokens] = useLocalStorage<{
    last_updated: number;
    data: TokenList['tokens'];
  }>('extended_tokens', {
    last_updated: 0,
    data: [],
  });
  const chain = useChain();
  useQuery({
    queryKey: ['extended_tokens', chain?.chainId],
    queryFn: async () =>
      (await (
        await fetch('https://analytics.xfai.com/api/token-list')
      ).json()) as TokenList['tokens'],
    onSuccess: (data) => {
      setExtendedTokens({
        last_updated: Date.now(),
        data: data,
      });
    },
    enabled: chain?.chainId && Date.now() - extendedTokens.last_updated > 1000 * 60 * 60 * 24,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => extendedTokens.data.filter((token) => token.chainId === chain?.chainId),
    [chain?.chainId, extendedTokens.data],
  );
};

export default useExtendedTokens;
