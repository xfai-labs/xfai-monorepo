import { TokenInfo } from '@uniswap/token-lists';
import { ParsedEthersError, getPoolBalanceMulticall } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useAccountQuery, { useAccountQueryOptions } from '../../meta/useAccountQuery';

const usePoolBalanceMulticall = (
  tokens: TokenInfo[],
  options?: useAccountQueryOptions<Record<string, BigNumber | undefined>, ParsedEthersError>,
) => {
  return useAccountQuery(
    ['poolBalanceMulticall', ...tokens.map((t) => t?.address)],
    async (xfai, account) => {
      return getPoolBalanceMulticall(xfai, account, tokens);
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
      ...options,
      enabled: tokens?.every((t) => Boolean(t?.address)) && (options?.enabled ?? true),
    },
  );
};
export default usePoolBalanceMulticall;
