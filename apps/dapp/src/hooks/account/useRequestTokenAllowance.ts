import { useQueryClient } from '@tanstack/react-query';
import { requestAllowance, requestINFTAllowance, sendPopulatedTx, Token } from '@xfai-labs/sdk';
import useWeb3Mutation from '../meta/useWeb3Mutation';

const useRequestTokenAllowance = (inft?: true) => {
  const queryClient = useQueryClient();

  return useWeb3Mutation(
    (xfai, token: Token) =>
      sendPopulatedTx(
        xfai,
        inft ? requestINFTAllowance(xfai, token) : requestAllowance(xfai, token),
      ),
    {
      retry: false,
      useErrorBoundary: false,
      onSuccess: (_, token) =>
        queryClient.invalidateQueries({
          queryKey: inft
            ? ['tokenAllowance', 'inft', token?.address]
            : ['tokenAllowance', token?.address],
        }),
    },
  );
};

export default useRequestTokenAllowance;
