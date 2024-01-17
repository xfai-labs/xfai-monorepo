import { UseQueryOptions } from '@tanstack/react-query';
import { getPoolTokenBalance } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useXfaiQuery from '../meta/useXfaiQuery';
import { TokenInfo } from '@uniswap/token-lists';

const usePoolTokenBalance = (
  token: undefined | TokenInfo,
  options?: UseQueryOptions<BigNumber>,
) => {
  return useXfaiQuery(
    ['poolTokenBalance', token?.address],
    (xfai) => getPoolTokenBalance(xfai, token!),
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
      enabled: !!token,
      ...options,
    },
  );
};
export default usePoolTokenBalance;
