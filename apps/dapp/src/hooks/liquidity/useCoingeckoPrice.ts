import { useQuery } from '@tanstack/react-query';
import { TokenInfo } from '@uniswap/token-lists';
import { PoolState } from '@xfai-labs/sdk';
import axios, { isAxiosError } from 'axios';
import { BigNumber } from 'ethers';
export const useCoingeckoPrice = (token?: TokenInfo, enabled = true) => {
  return useQuery<PoolState>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['coinGeckoPrice', token?.address],
    queryFn: async () => {
      const response = await axios.get<{
        prices: [number, number][];
      }>(
        `https://api.coingecko.com/api/v3/coins/linea/contract/${
          token!.address
        }/market_chart/?vs_currency=eth&days=.001&precision=18`,
      );
      return {
        reserve: BigNumber.from(10).pow(token!.decimals),
        ethReserve: BigNumber.from(Math.floor(response.data.prices[0][1] * 10 ** 18)),
      };
    },
    staleTime: 1000 * 60,
    retry: (f, e) => {
      if (isAxiosError(e)) {
        if (!e.status) return false;
        return e.status > 400 ? false : true;
      }
      return true;
    },
    enabled: !!token && enabled,
  });
};
