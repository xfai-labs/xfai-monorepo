import {
  FunctionComponent,
  ReactElement,
  HTMLAttributes,
  useCallback,
  useMemo,
  ChangeEvent,
  useState,
  useRef,
} from 'react';
import Body from './Body';
import Localization from '@dapp/localization';
import {
  Modal,
  ModalHeaderItem,
  SearchBar,
  IconSettings,
  ModalComponent,
  SkeletonWrapper,
} from '@xfai-labs/ui-components';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import useTokenSearch from '@dapp/hooks/tokens/useTokenSearch';
import { TokenInfo } from '@uniswap/token-lists';
import Token from '@dapp/components/Token';
import cs from 'classnames';
import { FixedSizeList } from 'react-window';
import useTokenBalanceMulticall from '@dapp/hooks/tokens/useTokenBalanceMulticall';
import { toggleAmount } from '@dapp/utils/formatting';
import { useElementSize } from 'usehooks-ts';
import { useXfai } from '@dapp/context/XfaiProvider';
import { useConnectWallet } from '@web3-onboard/react';

export type SelectTokenModalProps = {
  title?: string;
  onToken: (token: TokenInfo) => void | boolean;
  filter?: (token: TokenInfo) => boolean;
  selectedTokens?: (TokenInfo | undefined)[];
  needsLiquidityPool?: boolean;
  popularTokens?: boolean;
  fetchBalances?: boolean;
  includeNativeTokens?: 'both' | 'native' | 'erc20' | 'none';
};
type ItemProps = {
  style: React.CSSProperties;
  token: TokenInfo;
  balance: string | undefined;
  selected?: boolean;
  onTokenWithHideModal: (token: TokenInfo & { hasPool?: boolean }) => void;
};

const TokenView = ({ style, token, balance, selected, onTokenWithHideModal }: ItemProps) => {
  const [{ wallet }] = useConnectWallet();
  return (
    <button
      key={token.address}
      style={style}
      className={cs(
        'border-60 hover:bg-60 flex items-center justify-between border-b bg-transparent px-4 py-2 transition-colors last:border-b-0',
        selected && 'opacity-40',
      )}
      onClick={() => onTokenWithHideModal(token)}
    >
      <Token.View token={token} name />
      {balance &&
        !!wallet &&
        (balance === 'loading' ? (
          <SkeletonWrapper>
            <span className="text-20 block text-sm">00.00</span>
          </SkeletonWrapper>
        ) : (
          <span className="text-20 block text-sm">{balance}</span>
        ))}
    </button>
  );
};
const TokenList = ({
  tokens,
  fetchBalances,
  selectedTokenAddresses,
  needsLiquidityPool,
  onTokenWithHideModal,
}: {
  fetchBalances?: boolean;
  needsLiquidityPool?: boolean;
  tokens: TokenInfo[];
  selectedTokenAddresses?: (string | undefined)[];
  onTokenWithHideModal: (token: TokenInfo) => void;
}) => {
  const tokensToFetchTimeout = useRef<number>();
  const { showModal } = useGlobalModalContext();
  const [tokensToFetch, setTokensToFetch] = useState<TokenInfo[]>([]);
  const { data: balances } = useTokenBalanceMulticall(tokensToFetch, fetchBalances);
  const [wrapperRef, { width: wrapperWidth, height: wrapperHeight }] = useElementSize();

  const displayBalances = useMemo(
    () =>
      balances
        ? Object.fromEntries(
            tokens.map((token) => [token.address, toggleAmount(balances[token.address], token)]),
          )
        : {},
    [tokens, balances],
  );

  return (
    <div className="h-full w-full grow" ref={wrapperRef}>
      <FixedSizeList
        width={wrapperWidth}
        height={wrapperHeight}
        itemCount={tokens.length}
        itemSize={65}
        onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
          if (tokensToFetchTimeout.current) window.clearTimeout(tokensToFetchTimeout.current);
          tokensToFetchTimeout.current = window.setTimeout(
            () => setTokensToFetch(tokens.slice(visibleStartIndex, visibleStopIndex + 1)),
            300,
          );
        }}
      >
        {({ index, style }) => (
          <TokenView
            style={style}
            token={tokens[index]}
            balance={
              fetchBalances ? displayBalances[tokens[index].address] ?? 'loading' : undefined
            }
            onTokenWithHideModal={(token) => {
              if (
                (token.hasPool === false || token.tags?.includes('extended')) &&
                needsLiquidityPool !== false
              ) {
                showModal('UnknownTokenModal', {
                  token: token,
                });
                return;
              }
              onTokenWithHideModal(token);
            }}
            selected={selectedTokenAddresses?.includes(tokens[index].address)}
          />
        )}
      </FixedSizeList>
    </div>
  );
};

const SelectTokenModal: ModalComponent<SelectTokenModalProps> = ({
  title = Localization.Label.SELECT_A_TOKEN,
  onToken,
  filter,
  selectedTokens,
  needsLiquidityPool,
  popularTokens = true,
  includeNativeTokens,
  hideModal,
  setDismissible,
  fetchBalances,
}): ReactElement => {
  const { showSettings } = useGlobalModalContext();
  const xfai = useXfai();

  const { tokens, notFound, query, setQuery, queryIsAddress } = useTokenSearch({
    filter,
    includeNativeTokens,
    limit: 100,
  });

  const { tokens: popularTokenList } = useTokenSearch({
    filter: (token) =>
      (xfai.topTokenAddresses.includes(token.address) ?? false) && (filter ? filter(token) : true),
    includeNativeTokens,
  });

  const selectedTokenAddresses = useMemo(
    () => selectedTokens?.map((token) => token?.address),
    [selectedTokens],
  );

  const settingsButton: ModalHeaderItem = {
    icon: IconSettings,
    onClick: showSettings,
  };

  const onTokenWithHideModal = useCallback(
    async (token: TokenInfo) => {
      const result = await onToken(token);
      if (result !== false) hideModal();
    },
    [hideModal, onToken],
  );

  const ModalHeader: FunctionComponent<HTMLAttributes<HTMLUListElement>> = () => {
    return (
      <div className="flex flex-col gap-4 p-4 2xl:p-5">
        {popularTokens && popularTokenList.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h6 className="text-xsm md:text-sm">{Localization.Label.POPULAR_TOKENS}</h6>
            <ul className="flex gap-2.5">
              {popularTokenList.map((token) => (
                <li key={token.address}>
                  <Token.Tag
                    key={token.address}
                    token={token}
                    onClick={() => onTokenWithHideModal(token)}
                    className={selectedTokenAddresses?.includes(token.address) ? 'opacity-40' : ''}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        <SearchBar
          autoFocus={true}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          defaultValue={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
      </div>
    );
  };
  return (
    <Modal
      title={title}
      hideModal={hideModal}
      header={<ModalHeader />}
      headerRightButton={settingsButton}
      setDismissible={setDismissible}
      bodyClassName="!p-0"
      expandBody
    >
      {!notFound ? (
        <TokenList
          tokens={tokens}
          needsLiquidityPool={needsLiquidityPool}
          onTokenWithHideModal={onTokenWithHideModal}
          selectedTokenAddresses={selectedTokenAddresses}
          fetchBalances={fetchBalances}
        />
      ) : queryIsAddress ? (
        <Body.UnknownToken tokenOrAddress={query} needsLiquidityPool={needsLiquidityPool} />
      ) : (
        <Body.TokenNotFound />
      )}
    </Modal>
  );
};

export default SelectTokenModal;
