import { sendPopulatedTx, transfer, INFT, AccountAddress } from '@xfai-labs/sdk';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import { useQueryClient } from '@tanstack/react-query';

export const useTransferINFT = () => {
  const queryClient = useQueryClient();

  return useWeb3Mutation(
    (xfai, { inft, target }: { inft: INFT; target: string }) =>
      sendPopulatedTx(xfai, transfer(xfai, inft, AccountAddress(target))),
    {
      retry: false,
      useErrorBoundary: false,
      onSuccess: () => queryClient.invalidateQueries(['inftOwnership']),
    },
  );
};

export const useTransferINFTGasEstimate = () => {
  return useWeb3Estimate(['transferINftEstimate'], (xfai) =>
    transfer(
      xfai,
      INFT(1),
      AccountAddress('0xc99a630d8f730FD8D71fafD18C161AD47132f3Bf'), // Random address for gas estimation
    ),
  );
};
