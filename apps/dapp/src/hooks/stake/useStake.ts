import { useQueryClient } from '@tanstack/react-query';
import { sendPopulatedTx, stakeToken, Xfai } from '@xfai-labs/sdk';
import Stake from '@dapp/types/Stake';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import { addMinutes } from 'date-fns';

export const useStake = () => {
  const queryClient = useQueryClient();
  return useWeb3Mutation((xfai, stake: Stake) => doStake(xfai, stake), {
    retry: false,
    useErrorBoundary: false,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tokenBalance'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['tokenBalanceMulticall'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['inftBalance'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['inftState'],
        }),
      ]),
  });
};

const doStake = async (xfai: Xfai, stake: Stake) => {
  const wallet = await xfai.provider.getSigner();
  return sendPopulatedTx(
    xfai,
    stakeToken(xfai, stake.amount, stake.minShares, {
      deadline: addMinutes(new Date(), 20),
      from: wallet,
      inft: stake.inft,
    }),
  );
};

const STAKE_UNDERLYING_GAS = 240_000;

export const useStakeGasEstimate = (stake: Stake) =>
  useWeb3Estimate(['estimateStake', stake], () => STAKE_UNDERLYING_GAS);
