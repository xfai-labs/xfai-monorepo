import { useQueryClient } from '@tanstack/react-query';
import {
  isNativeToken,
  isSharedToken,
  isWrappedNativeToken,
  sendPopulatedTx,
  swapTokens,
} from '@xfai-labs/sdk';
import Swap from '@dapp/types/Swap';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import { addMinutes } from 'date-fns';
import { useConnectWallet } from '@web3-onboard/react';
export const useSwap = () => {
  const queryClient = useQueryClient();
  const [_, _c, _d, updateBalances] = useConnectWallet();
  return useWeb3Mutation(
    (xfai, trade: Swap) =>
      sendPopulatedTx(
        xfai,
        swapTokens(
          xfai,
          trade.type,
          trade.tokenIn.token,
          trade.tokenOut.token,
          trade.tokenIn.amount,
          trade.tokenOut.amount,
          {
            deadline: addMinutes(new Date(), 20),
            from: xfai.provider.getSigner(),
            slippage: trade.slippage,
          },
        ),
      ),
    {
      retry: false,
      useErrorBoundary: false,
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['poolState'],
          }),
          updateBalances(),
          queryClient.invalidateQueries({
            queryKey: ['tokenBalance'],
          }),
          queryClient.invalidateQueries({
            queryKey: ['tokenBalanceMulticall'],
          }),
        ]),
    },
  );
};
const SWAP_GAS = 185_000;
const SWAP_SHARED_GAS = 145_000;

export const useSwapGasEstimate = (trade: Swap, refetch = true) =>
  useWeb3Estimate(
    ['estimateSwap', trade],
    (xfai) => {
      if (
        (isWrappedNativeToken(xfai, trade.tokenIn.token) && isNativeToken(trade.tokenOut.token)) ||
        (isWrappedNativeToken(xfai, trade.tokenOut.token) && isNativeToken(trade.tokenIn.token))
      ) {
        // eth wrapping/unwrapping
        return 50_000;
      }

      return isSharedToken(xfai, trade.tokenIn.token) || isSharedToken(xfai, trade.tokenOut.token)
        ? SWAP_SHARED_GAS
        : SWAP_GAS;
    },
    {
      refetchInterval: refetch ? undefined : false,
    },
  );
