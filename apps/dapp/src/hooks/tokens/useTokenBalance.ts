import { TokenInfo } from '@uniswap/token-lists';
import { AccountAddress, getTokenBalance } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useAccountQuery from '../meta/useAccountQuery';

const useTokenBalance = (token: undefined | 'native' | 'xfit' | TokenInfo) => {
  return useAccountQuery<BigNumber>(
    ['tokenBalance', token],
    (xfai, account) => {
      if (token === 'native') {
        return getTokenBalance(xfai, AccountAddress(account.address), xfai.nativeToken);
      }
      if (token === 'xfit') {
        return getTokenBalance(xfai, AccountAddress(account.address), xfai.underlyingToken);
      }
      return getTokenBalance(xfai, AccountAddress(account.address), token!);
    },
    {
      enabled: !!token,
      staleTime: Infinity,
      retry: 2,
      initialData: (wallet) => {
        if (wallet) {
          return undefined;
        }
        return BigNumber.from(0);
      },
    },
  );
};

export default useTokenBalance;
