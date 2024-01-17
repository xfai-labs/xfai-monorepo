import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Xfai } from '@xfai-labs/sdk';
import { useXfai } from '@dapp/context/XfaiProvider';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const useBackendQueryKey = (keys: readonly unknown[]) => {
  const xfai = useXfai();

  return [...keys, `backend`, `chain:${xfai.chain.chainId}`];
};

const client = axios.create({
  responseType: 'json',
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

const useBackendQuery = <T, TData = AxiosResponse<T>, TError = AxiosError>(
  keys: readonly unknown[],
  func: (
    xfai: Xfai,
    context: QueryFunctionContext,
  ) => Omit<AxiosRequestConfig<TData>, 'baseURL' | 'responseType'>,
  options: UseQueryOptions<AxiosResponse<T>, TError, TData> = {},
) => {
  const xfai = useXfai();
  return useQuery<AxiosResponse<T>, TError, TData>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...keys, `backend`, `chain:${xfai.chain.chainId}`],
    queryFn: async (context) => {
      const a = await client({
        baseURL: xfai.chain.backendApi,

        ...func(xfai, context),
      });
      return a;
    },
    ...options,
  });
};

export default useBackendQuery;
