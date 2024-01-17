import { ethers } from 'ethers';
import { matchSorter } from 'match-sorter';
import { useMemo, useState } from 'react';
import { useXfai } from '@dapp/context/XfaiProvider';
import { useChainSavedLiquidityTokens } from '@dapp/context/SavedTokens';
import { uniqBy } from 'lodash';
import { useTokens } from '@dapp/context/Tokens';
import useExtendedTokens from '../useExtendedTokens';
import { TokenInfo } from '@uniswap/token-lists';
import { isSharedToken } from '@xfai-labs/sdk';
type Props = {
  filter?: (token: TokenInfo) => boolean;
  limit?: number;
  includeSavedLiquidityTokens?: boolean;
  includeNativeTokens?: 'both' | 'native' | 'erc20' | 'none';
};

const useTokenSearch = ({
  filter,
  limit,
  includeNativeTokens,
  includeSavedLiquidityTokens,
}: Props) => {
  const xfai = useXfai();
  const allTokens = useTokens();
  const savedLiquidityTokens = useChainSavedLiquidityTokens(true);
  const [query, setQuery] = useState<string>('');
  const extendedTokens = useExtendedTokens();

  const filteredTokens = useMemo(() => {
    let tokens = Object.values(allTokens);
    if (query !== '') {
      tokens = uniqBy(tokens.concat(extendedTokens), 'address');
    } else {
      tokens = uniqBy(
        tokens.concat(extendedTokens.filter((t) => !t.tags?.includes('extended'))),
        'address',
      );
    }

    if (includeNativeTokens === 'native')
      tokens = tokens.filter((token) => token.address !== xfai.wrappedNativeToken.address);
    if (includeNativeTokens === 'erc20')
      tokens = tokens.filter((token) => token.address !== xfai.nativeToken.address);
    if (includeNativeTokens === 'none')
      tokens = tokens.filter((token) => !isSharedToken(xfai, token));
    if (filter) tokens = tokens.filter((token) => filter(token));
    return tokens;
  }, [allTokens, query, includeNativeTokens, filter, extendedTokens, xfai]);

  const queriedTokens = useMemo(
    () =>
      matchSorter(filteredTokens, query, {
        keys: ['symbol', 'name', 'address'],
        sorter: query.length === 0 ? (rankedItems) => rankedItems : void 0,
        baseSort: (a, b) => {
          const A = a.item.tags?.includes('extended') ? -1 : 1 ?? 0;
          const B = b.item.tags?.includes('extended') ? -1 : 1 ?? 0;
          return A < B ? 1 : -1;
        },
      }),
    [filteredTokens, query],
  );

  const limitedTokens = useMemo(
    () => (limit ? queriedTokens.slice(0, limit) : queriedTokens),
    [queriedTokens, limit],
  );

  const withLiquidityTokens = useMemo(() => {
    if (!includeSavedLiquidityTokens) return limitedTokens;
    return uniqBy(savedLiquidityTokens.concat(limitedTokens), 'address');
  }, [includeSavedLiquidityTokens, savedLiquidityTokens, limitedTokens]);

  return {
    setQuery,
    query,
    notFound: queriedTokens.length === 0 && query.length > 0,
    queryIsAddress: ethers.utils.isAddress(query),
    tokens: withLiquidityTokens,
  };
};

export default useTokenSearch;
