import { getPoolTokenBalanceMulticall, Token } from '@xfai-labs/sdk';
import useXfaiQuery from '../../meta/useXfaiQuery';

const usePoolTokenBalanceMulticall = (tokens: Token[]) => {
  return useXfaiQuery(
    ['poolTokenBalanceMulticall', ...tokens.map((t) => t.address)],
    async (xfai) => {
      return getPoolTokenBalanceMulticall(xfai, tokens);
    },
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  );
};
export default usePoolTokenBalanceMulticall;
