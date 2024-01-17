import { AccountAddress, getPeripheryAllowance, getPoolFromToken, Token } from '@xfai-labs/sdk';
import useAccountQuery from '../meta/useAccountQuery';
import { BigNumber } from 'ethers';

const useGetPoolAllowance = (token: Token) =>
  useAccountQuery(
    ['poolAllowance', token?.address],
    async (xfai, account) => {
      try {
        return getPeripheryAllowance(
          xfai,
          AccountAddress(account?.address),
          getPoolFromToken(xfai, token),
        );
      } catch (e) {
        return BigNumber.from(0);
      }
    },
    {
      enabled: !!token,
      staleTime: Infinity,
    },
  );
export default useGetPoolAllowance;
