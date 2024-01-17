import { useAppContext } from '@dapp/context/AppContext';
import { LiquidityInAmount, addLiquidity, sendPopulatedTx } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import { useQueryClient } from '@tanstack/react-query';
import { useSavedTokens } from '@dapp/context/SavedTokens';
import { addMinutes } from 'date-fns';
import { TokenInfo } from '@uniswap/token-lists';
import { useConnectWallet } from '@web3-onboard/react';

export type AddLiquidity = {
  ethAmount: BigNumber;
  target: LiquidityInAmount<TokenInfo>;
  poolShare: string;
};

export const useLiquidityAdd = () => {
  const { addLiquidityToken } = useSavedTokens();
  const { lpSlippage } = useAppContext();
  const queryClient = useQueryClient();
  const [_, _c, _d, updateBalances] = useConnectWallet();

  return useWeb3Mutation(
    (xfai, { ethAmount, target }: AddLiquidity) => {
      return sendPopulatedTx(
        xfai,
        addLiquidity(xfai, ethAmount, target, {
          from: xfai.provider.getSigner(),
          deadline: addMinutes(new Date(), 20),
          slippage: lpSlippage,
        }),
      );
    },
    {
      onSuccess: async (data, liquidity) => {
        if (liquidity) {
          await addLiquidityToken(liquidity.target.token);
        }
        await Promise.all([
          updateBalances(),
          queryClient.invalidateQueries({
            queryKey: ['poolState'],
          }),
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
        ]);
      },
    },
  );
};

const LIQUIDUTY_ADD_GAS = 205_000;

export const useLiquidityAddGasEstimate = (_addLiq: AddLiquidity) =>
  useWeb3Estimate(['estimateAddLiquidity'], () => LIQUIDUTY_ADD_GAS);
