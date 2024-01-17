import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ParsedEthersError, Xfai } from '@xfai-labs/sdk';
import { useXfai } from '@dapp/context/XfaiProvider';
import { getParsedEthersError, type EthersError } from '@enzoferey/ethers-error-parser';

export const useXfaiQueryKey = (keys: readonly unknown[]) => {
  const xfai = useXfai();

  return [...keys, `chain:${xfai.chain.chainId}`];
};

const useXfaiQuery = <T, TError = ParsedEthersError, TData = T>(
  keys: readonly unknown[],
  func: (xfai: Xfai, context: QueryFunctionContext) => Promise<T>,
  options: UseQueryOptions<T, TError, TData> = {},
) => {
  const xfai = useXfai();
  return useQuery<T, TError, TData>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...keys, `chain:${xfai.chain.chainId}`],
    queryFn: async (context) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return await func(xfai, context);
      } catch (error) {
        const parsedEthersError = getParsedEthersError(error as EthersError);
        // eslint-disable-next-line no-throw-literal
        throw {
          type: 'ParsedEthersError',
          error,
          context: parsedEthersError,
        } as ParsedEthersError;
      }
    },
    ...options,
  });
};

export default useXfaiQuery;
