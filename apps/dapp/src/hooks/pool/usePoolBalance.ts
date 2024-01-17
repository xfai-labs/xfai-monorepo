import { TokenInfo } from '@uniswap/token-lists';
import { ParsedEthersError, getPoolBalance } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useAccountQuery, { useAccountQueryOptions } from '../meta/useAccountQuery';

const usePoolBalance = (
  token: undefined | TokenInfo,
  options?: useAccountQueryOptions<BigNumber, ParsedEthersError>,
) => {
  return useAccountQuery(
    ['poolBalance', token?.address],
    (xfai, account) => getPoolBalance(xfai, account, token!),
    {
      enabled: !!token,
      staleTime: 1000 * 60 * 5,
      retry: false,
      ...options,
    },
  );
};
export default usePoolBalance;
