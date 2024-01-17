import {
  ParsedEthersError,
  PoolState,
  getPoolFromToken,
  getPoolState,
  isSharedToken,
} from '@xfai-labs/sdk';
import useXfaiQuery from './meta/useXfaiQuery';
import { TokenInfo } from '@uniswap/token-lists';
import { useSavedTokens } from '@dapp/context/SavedTokens';
import { BigNumber } from 'ethers';

const usePoolState = (token: (TokenInfo & { hasPool?: boolean }) | undefined) => {
  const { addSavedToken } = useSavedTokens();
  return useXfaiQuery<PoolState, ParsedEthersError>(
    ['poolState', token?.address],
    async (xfai) => {
      if (isSharedToken(xfai, token!)) {
        return {
          ethReserve: BigNumber.from(1),
          reserve: BigNumber.from(1),
        };
      }
      return getPoolState(xfai, getPoolFromToken(xfai, token!));
    },
    {
      refetchInterval: 1000 * 30,
      staleTime: 1000 * 10,
      enabled: !!token?.address,
      retry: 0,
      onSuccess: () => {
        if (token?.hasPool === false) {
          addSavedToken({
            ...token,
            hasPool: true,
          });
        }
      },
    },
  );
};

export default usePoolState;
