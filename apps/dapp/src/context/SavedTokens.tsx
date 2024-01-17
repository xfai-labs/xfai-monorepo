import { useQueryClient } from '@tanstack/react-query';
import type { TokenInfo } from '@uniswap/token-lists';
import type { ConnectedChain } from '@web3-onboard/core';
import { useCallback, useContext, createContext, ReactElement, FC } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { cloneDeep, noop } from 'lodash';
import useChain from '@dapp/hooks/chain/useChain';
import { flushSync } from 'react-dom';
import { getAddress } from '@ethersproject/address';

export type SavedTokens = Record<
  ConnectedChain['id'],
  Record<TokenInfoWithPool['address'], TokenInfoWithPool>
>;

type TokenInfoWithPool = TokenInfo & { hasPool?: boolean };

type SavedTokensContext = {
  liquidityTokens: SavedTokens;
  savedTokens: SavedTokens;
  addSavedToken: (token: Omit<TokenInfoWithPool, 'chainId'>) => void;
  addLiquidityToken: (token: Omit<TokenInfoWithPool, 'chainId'>) => void;
  removeLiquidityToken: (tokenAddress: TokenInfoWithPool['address']) => void;
  removeSavedToken: (tokenAddress: TokenInfoWithPool['address']) => void;
};

export type ChainSavedToken = SavedTokens[number];

const SavedTokensContext = createContext<SavedTokensContext>({
  liquidityTokens: {},
  savedTokens: {},
  addSavedToken: noop,
  removeSavedToken: noop,
  addLiquidityToken: noop,
  removeLiquidityToken: noop,
});

export const useSavedTokens = () => useContext(SavedTokensContext);

export function useChainSavedTokens(array: true): TokenInfoWithPool[];
export function useChainSavedTokens(array?: false): ChainSavedToken;
export function useChainSavedTokens(array = false) {
  const chain = useChain();
  const { savedTokens } = useSavedTokens();

  if (!chain?.chainId) return array ? [] : {};

  return array ? Object.values(savedTokens[chain.chainId] ?? {}) : savedTokens[chain.chainId] ?? {};
}

export function useChainSavedLiquidityTokens(array: true): TokenInfoWithPool[];
export function useChainSavedLiquidityTokens(array?: false): ChainSavedToken;
export function useChainSavedLiquidityTokens(array = false) {
  const chain = useChain();
  const { liquidityTokens } = useSavedTokens();
  if (!chain?.chainId) return array ? [] : {};

  return array
    ? Object.values(liquidityTokens[chain.chainId] ?? {})
    : liquidityTokens[chain.chainId] ?? {};
}
const version = 'V1:';
export const SavedTokensProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const chain = useChain();
  const queryClient = useQueryClient();
  const [savedTokens, setSavedTokens] = useLocalStorage<SavedTokens>(`${version}saved_tokens`, {});
  const [liquidityTokens, setLiquidityTokens] = useLocalStorage<SavedTokens>(
    `${version}liquidity_tokens`,
    {},
  );

  const addToken = useCallback(
    async (token: Omit<TokenInfoWithPool, 'chainId'>, store: 'savedTokens' | 'liquidityTokens') => {
      if (!chain?.chainId) return;
      const newTokenList = cloneDeep(store === 'savedTokens' ? savedTokens : liquidityTokens);

      // init chain
      newTokenList[chain.chainId] ??= {};

      // add token to respective bucket
      newTokenList[chain.chainId][getAddress(token.address)] = {
        ...token,
        address: getAddress(token.address),
        chainId: chain.chainId,
        tags: ['imported'],
      };

      flushSync(() => {
        store === 'savedTokens' ? setSavedTokens(newTokenList) : setLiquidityTokens(newTokenList);
      });
      await queryClient.invalidateQueries({
        queryKey: ['tokenList'],
      });
    },
    [chain?.chainId, savedTokens, liquidityTokens, queryClient, setSavedTokens, setLiquidityTokens],
  );

  const removeToken = useCallback(
    (tokenAddress: TokenInfoWithPool['address'], store: 'savedTokens' | 'liquidityTokens') => {
      if (!chain?.chainId) return;
      const newTokenList = cloneDeep(store === 'savedTokens' ? savedTokens : liquidityTokens);

      delete newTokenList[chain.chainId][getAddress(tokenAddress)];

      store === 'savedTokens' ? setSavedTokens(newTokenList) : setLiquidityTokens(newTokenList);
      queryClient.invalidateQueries({
        queryKey: ['tokenList'],
      });
    },
    [savedTokens, liquidityTokens, chain?.chainId, setSavedTokens, setLiquidityTokens, queryClient],
  );

  const addSavedToken = useCallback(
    (token: Omit<TokenInfoWithPool, 'chainId'>) => addToken(token, 'savedTokens'),
    [addToken],
  );

  const removeSavedToken = useCallback(
    (token: TokenInfoWithPool['address']) => removeToken(token, 'savedTokens'),
    [removeToken],
  );

  const addLiquidityToken = useCallback(
    (token: Omit<TokenInfoWithPool, 'chainId'>) => addToken(token, 'liquidityTokens'),
    [addToken],
  );

  const removeLiquidityToken = useCallback(
    (token: TokenInfoWithPool['address']) => removeToken(token, 'liquidityTokens'),
    [removeToken],
  );

  return (
    <SavedTokensContext.Provider
      value={{
        savedTokens,
        liquidityTokens,
        addSavedToken,
        addLiquidityToken,
        removeLiquidityToken,
        removeSavedToken,
      }}
      children={children}
    />
  );
};
