import { TokenInfo } from '@uniswap/token-lists';
import { ConnectedChain } from '@web3-onboard/core';
import { useContext, FC, ReactElement, createContext, useMemo } from 'react';
import { useXfai } from './XfaiProvider';
import useFetchTokenOrder from '@dapp/hooks/useFetchTokenOrder';
import { useChainSavedTokens } from './SavedTokens';

export type SavedTokens = Record<ConnectedChain['id'], Record<TokenInfo['address'], TokenInfo>>;

const TokensContext = createContext<Record<string, TokenInfo>>({});

export const useTokens = () => useContext(TokensContext);

export const TokensProvider: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const savedTokens = useChainSavedTokens(true);
  const xfai = useXfai();
  const tokenOrder = useFetchTokenOrder();
  const defaultTokenList = useMemo(() => {
    const allTokens = savedTokens.concat(
      xfai.chain.defaultTokenList.tokens
        .concat(
          [xfai.nativeToken, xfai.wrappedNativeToken, xfai.usdc, xfai.underlyingToken].filter(
            Boolean,
          ),
        )
        .sort((a, b) => (tokenOrder[a.address] ?? 0) - (tokenOrder[b.address] ?? 0))
        .reverse(),
    );

    return Object.fromEntries(allTokens.map((t) => [t.address, t]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xfai.chain.chainId, tokenOrder, savedTokens]);

  return <TokensContext.Provider value={defaultTokenList} children={children} />;
};
