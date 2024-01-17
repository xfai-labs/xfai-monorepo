import { BigNumber } from 'ethers';
import { TokenInfo } from '@uniswap/token-lists';
import { useCallback, useMemo } from 'react';
import { toggleAmount } from '@dapp/utils/formatting';
import { useQuery } from '@tanstack/react-query';
import useXfaiQuery from '../meta/useXfaiQuery';
import { getOraclePrice, isNativeToken, isWrappedNativeToken } from '@xfai-labs/sdk';
import usePoolState from '../usePoolState';
import { useXfai } from '@dapp/context/XfaiProvider';

export const useEthFiatValue = () => {
  type CoinBaseResponse = {
    0: {
      current_price: number;
    };
  };
  return useQuery({
    queryKey: ['eth-value'],
    queryFn: () =>
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum').then(
        (res) => res.json() as Promise<CoinBaseResponse>,
      ),
    select: (res) => res[0].current_price,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 20,
  });
};

const useOraclePrice = (token: undefined | TokenInfo) =>
  useXfaiQuery(['oracle-price', token?.address], (xfai) => getOraclePrice(xfai, token!), {
    enabled: !!token && !!token.extensions?.chainLinkOracleAddress,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
  });

const useGetEthValue = (token: undefined | TokenInfo) => {
  const xfai = useXfai();
  const shouldGet = !token?.extensions?.chainLinkOracleAddress;

  const { data: tokenState } = usePoolState(shouldGet ? token : undefined);

  return useMemo(() => {
    if (tokenState && token && xfai) {
      return BigNumber.from(10)
        .pow(token.decimals)
        .mul(tokenState.ethReserve)
        .div(tokenState.reserve);
    }
    return undefined;
  }, [token, tokenState, xfai]);
};

function useFiatValue(
  token: undefined | TokenInfo,
): (amount: 'unit' | undefined | string | BigNumber) => undefined | BigNumber {
  const { data: ethUSD } = useEthFiatValue();
  const xfai = useXfai();

  const { data: tokenInEth1 } = useOraclePrice(token);
  const tokenInEth2 = useGetEthValue(token);

  const tokenInEth3 = tokenInEth1 || tokenInEth2;

  return useCallback(
    (amount) => {
      let tokenInEth = tokenInEth3;
      if (token && (isNativeToken(token) || isWrappedNativeToken(xfai, token))) {
        tokenInEth = BigNumber.from(10).pow(18);
      }

      if (!tokenInEth || !ethUSD || !token) return undefined;

      if (amount === undefined) return;

      if (typeof amount === 'string' && amount !== 'unit') {
        amount = toggleAmount(amount, token);
      }

      const amountBN = amount === 'unit' ? BigNumber.from(10).pow(token.decimals) : amount;

      return amountBN
        .mul(tokenInEth)
        .div(BigNumber.from(10).pow(token.decimals))
        .mul(Math.floor(ethUSD * 100))
        .div(BigNumber.from(10).pow(18 - 6 + 2));
    },
    [ethUSD, token, tokenInEth3, xfai],
  );
}

export default useFiatValue;
