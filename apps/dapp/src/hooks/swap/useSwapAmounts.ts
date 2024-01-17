import { useXfai } from '@dapp/context/XfaiProvider';
import { useMutation } from '@tanstack/react-query';
import { getSwapAmounts, PoolState, TradeType, SwapAmount } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import { TokenInfo } from '@uniswap/token-lists';

type Swap<T extends PoolState | undefined = PoolState | undefined> = {
  tradeType: TradeType;
  tokenIn: {
    token: TokenInfo;
    state: T;
  };
  tokenOut: {
    token: TokenInfo;
    state: T extends undefined ? PoolState : PoolState | undefined;
  };
  amount: BigNumber;
};
const useSwapAmounts = () => {
  const xfai = useXfai();
  return useMutation<SwapAmount, unknown, Swap>({
    mutationKey: ['swapAmounts'],
    mutationFn: async ({ tradeType, tokenIn, tokenOut, amount }) =>
      getSwapAmounts(xfai, tradeType, tokenIn, tokenOut, amount),
  });
};

export default useSwapAmounts;
