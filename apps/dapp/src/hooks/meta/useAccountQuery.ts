/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { QueryFunctionContext, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { ParsedEthersError, Xfai } from '@xfai-labs/sdk';
import type { Account } from '@web3-onboard/core/dist/types';
import { useConnectWallet } from '@web3-onboard/react';
import useXfaiQuery, { useXfaiQueryKey } from './useXfaiQuery';

export type useAccountQueryOptions<
  TQueryFnData,
  TError extends ParsedEthersError = ParsedEthersError,
  TData = TQueryFnData,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'initialData'> & {
  initialData?: (wallet: boolean) => TQueryFnData | undefined;
};
const useAccountQuery = <
  TQueryFnData,
  TError extends ParsedEthersError = ParsedEthersError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  keys: TQueryKey,
  func: (xfai: Xfai, account: Account, context: QueryFunctionContext) => Promise<TQueryFnData>,
  options: useAccountQueryOptions<TQueryFnData, TError, TData> = {},
) => {
  const [{ wallet }] = useConnectWallet();

  return useXfaiQuery<TQueryFnData, TError, TData>(
    [...keys, wallet?.accounts[0]?.address],
    (xfai, context) => func(xfai, wallet!.accounts[0]!, context),
    {
      ...options,
      enabled: !!wallet?.accounts[0] && (options.enabled ?? true),
      initialData: () => {
        if (options.initialData && typeof options.initialData === 'function') {
          return options.initialData(!!wallet?.accounts[0]);
        }
        return options.initialData;
      },
    },
  );
};

export const useAccountQueryKey = (keys: unknown[]) => {
  const [{ wallet }] = useConnectWallet();
  return useXfaiQueryKey([...keys, wallet?.accounts[0]?.address]);
};
export default useAccountQuery;
