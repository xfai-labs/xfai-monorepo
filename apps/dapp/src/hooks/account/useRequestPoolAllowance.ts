import { useQueryClient } from '@tanstack/react-query';
import { Token, getPoolFromToken, requestAllowance, sendPopulatedTx } from '@xfai-labs/sdk';
import useWeb3Mutation from '../meta/useWeb3Mutation';

const useRequestPoolAllowance = () => {
  const queryClient = useQueryClient();

  return useWeb3Mutation(
    (xfai, token: Token) =>
      sendPopulatedTx(xfai, requestAllowance(xfai, getPoolFromToken(xfai, token))),
    {
      retry: false,
      useErrorBoundary: false,
      onSuccess: (_, token) =>
        queryClient.invalidateQueries({
          queryKey: ['poolAllowance', token?.address],
        }),
    },
  );
};

export default useRequestPoolAllowance;
