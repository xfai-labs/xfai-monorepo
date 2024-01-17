import { UseQueryOptions } from '@tanstack/react-query';
import { getPoolSupply, Token } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useXfaiQuery from '../meta/useXfaiQuery';

const usePoolSupply = (token: undefined | Token, options?: UseQueryOptions<BigNumber>) => {
  return useXfaiQuery(
    ['poolTotalLiquidity', token?.address],
    (xfai) => getPoolSupply(xfai, token!),
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
      enabled: !!token,
      ...options,
    },
  );
};
export default usePoolSupply;
