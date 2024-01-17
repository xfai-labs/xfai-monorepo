import { TokenInfo } from '@uniswap/token-lists';
import { isSharedToken, removeLiquidity, sendPopulatedTx } from '@xfai-labs/sdk';
import { BigNumber, BigNumberish } from 'ethers';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import { useQueryClient } from '@tanstack/react-query';
import { addMinutes } from 'date-fns';
import { useConnectWallet } from '@web3-onboard/react';

export type RemoveLiquidity = {
  lpAmount: BigNumber;
  target: {
    amount: BigNumber;
    token: TokenInfo;
  };
  supplementary: {
    amount: BigNumber;
    token: TokenInfo;
  };
  slippage: BigNumberish;
};

export const useLiquidityRedeem = () => {
  const queryClient = useQueryClient();
  const [_, _c, _d, updateBalances] = useConnectWallet();

  return useWeb3Mutation(
    (xfai, { lpAmount, target, supplementary, slippage }: RemoveLiquidity) =>
      sendPopulatedTx(
        xfai,
        removeLiquidity(
          xfai,
          lpAmount,
          {
            token: target.token,
            desiredAmount: target.amount,
          },
          {
            token: supplementary.token,
            desiredAmount: supplementary.amount,
          },
          {
            from: xfai.provider.getSigner(),
            deadline: addMinutes(new Date(), 20),
            slippage,
          },
        ),
      ),
    {
      onSuccess: () =>
        Promise.all([
          updateBalances(),
          queryClient.invalidateQueries({
            queryKey: ['tokenBalance'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['tokenBalanceMulticall'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolBalanceMulticall'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolStateMulticall'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolTokenBalance'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolTotalLiquidity'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolState'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['poolAllowance'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['inftBalance'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['inftState'],
          }),
        ]),
    },
  );
};

export const useLiquidityRedeemGasEstimate = (removeLiq: RemoveLiquidity | undefined) => {
  return useWeb3Estimate(
    ['redeemEstimate', removeLiq?.supplementary.token.address],
    (xfai) => {
      if (isSharedToken(xfai, removeLiq!.supplementary.token)) {
        return 190_000;
      }
      return 225000;
    },
    {
      enabled: !!removeLiq,
    },
  );
};
