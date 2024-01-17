import { useTokens } from '@dapp/context/Tokens';
import { TokenInfo } from '@uniswap/token-lists';

const useGetToken = (tokenAddress: string): { token?: TokenInfo } => {
  const tokens = useTokens();

  return {
    token: tokens[tokenAddress] ?? undefined,
  };
};

export default useGetToken;
