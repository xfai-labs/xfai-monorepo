import { INFT, INFTBalance, Token, getINFTTokenBalanceMulticall } from '@xfai-labs/sdk';
import useXfaiQuery from '../meta/useXfaiQuery';
import useTokenSearch from '../tokens/useTokenSearch';
import { TokenInfo } from '@uniswap/token-lists';
export function useINFTTopTokenBalances(inft: INFT) {
  const { tokens: topTokens } = useTokenSearch({
    limit: 5,
    includeNativeTokens: 'native',
  });

  return useXfaiQuery(
    ['inftAccumulatedBalance', topTokens, inft.id.toString()],
    (xfai) =>
      getINFTTokenBalanceMulticall(
        xfai,
        inft,
        topTokens.map((t) => Token(t.address)),
        true,
      ),
    {
      select: (balances) =>
        Object.entries(balances)
          // Filtering tokens without pools/errors
          .filter(([_, balance]) => balance)
          .map(
            ([address, balance]) =>
              [topTokens.find((t) => t.address === address), balance] as [
                TokenInfo | undefined,
                INFTBalance,
              ],
          )
          .filter(([token]) => token) as [TokenInfo, INFTBalance][],
      enabled: !!topTokens?.length,
    },
  );
}
