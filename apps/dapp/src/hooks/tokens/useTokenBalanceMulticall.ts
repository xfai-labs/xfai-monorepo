import { useQueries, useQueryClient } from '@tanstack/react-query';
import { getTokenBalanceMulticall, Token } from '@xfai-labs/sdk';
import { useEffect, useState } from 'react';
import useAccountQuery from '../meta/useAccountQuery';
import { BigNumber } from 'ethers';

const useTokenBalanceMulticall = (tokens: Token[], enabled = true) => {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<Record<string, BigNumber | undefined>>([
    'tokenBalanceMulticall',
  ]);

  const [toFetch, setToFetch] = useState<string[]>([]);
  const [data, setData] = useState(cachedData);

  useEffect(() => {
    queryClient.setQueryData(['tokenBalanceMulticall'], () => data);
  }, [data, queryClient]);

  useQueries({
    queries: tokens.map((token) => ({
      queryKey: ['tokenBalanceMulticallFetcher', token.address],
      queryFn: () => {
        setToFetch((toFetch) => [...toFetch, token.address]);
        return 1;
      },
      staleTime: 1000 * 30, // 30 sec
      refetchInterval: 1000 * 30, // 30 sec
    })),
  });
  const { data: _, ...balances } = useAccountQuery(
    ['tokenBalanceMulticall'],
    async (xfai, account) => {
      return getTokenBalanceMulticall(
        xfai,
        account,
        toFetch.map((t) => Token(t)),
      );
    },
    {
      onSuccess: (data) => {
        const fetchedAddresses = Object.keys(data);
        setToFetch((toFetch) => toFetch.filter((address) => !fetchedAddresses.includes(address)));
        setData((oldData) => ({ ...oldData, ...data }));
        queryClient.setQueryData(['tokenBalanceMulticall'], () => data);
      },
      enabled: enabled && toFetch.length > 0,
      refetchInterval: 500,
      retry: false,
    },
  );
  return {
    ...balances,
    data,
  };
};
export default useTokenBalanceMulticall;
