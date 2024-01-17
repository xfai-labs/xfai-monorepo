import { TokenInfo } from '@uniswap/token-lists';
import { AccountAddress, getINFTPeripheryAllowance } from '@xfai-labs/sdk';
import useAccountQuery from '../meta/useAccountQuery';

const useGetTokenINFTAllowance = (token: undefined | TokenInfo) =>
  useAccountQuery(
    ['tokenAllowance', 'inft', token?.address],
    async (xfai, account) => {
      const allowance = await getINFTPeripheryAllowance(
        xfai,
        AccountAddress(account?.address),
        token!,
      );
      return allowance;
    },
    {
      enabled: !!token,
      staleTime: Infinity,
    },
  );
export default useGetTokenINFTAllowance;
