import { UseQueryOptions } from '@tanstack/react-query';
import { getPoolLiquidityMulticall, Token } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useXfaiQuery from '../../meta/useXfaiQuery';

const usePoolLiquidityMulticall = (
  tokens: Token[],
  options?: UseQueryOptions<Record<string, BigNumber | undefined>>,
) => {
  return useXfaiQuery(
    ['poolStateMulticall', ...tokens.map((t) => t.address)],
    async (xfai) => {
      return getPoolLiquidityMulticall(xfai, tokens);
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
      ...options,
    },
  );
};
export default usePoolLiquidityMulticall;
