import { TokenInfo } from '@uniswap/token-lists';
import { AccountAddress, getPeripheryAllowance } from '@xfai-labs/sdk';
import useAccountQuery from '../meta/useAccountQuery';

const useGetTokenAllowance = (token: undefined | TokenInfo) =>
  useAccountQuery(
    ['tokenAllowance', token?.address],
    async (xfai, account) => getPeripheryAllowance(xfai, AccountAddress(account?.address), token!),
    {
      enabled: !!token,
      staleTime: Infinity,
    },
  );
export default useGetTokenAllowance;
