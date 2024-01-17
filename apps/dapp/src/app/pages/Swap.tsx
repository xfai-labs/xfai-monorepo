import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import {
  Button,
  ButtonIcon,
  FormTitle,
  DivideContainer,
  IconSwapArrows,
  IconSliders,
  InlineLink,
} from '@xfai-labs/ui-components';
import AmountBox from '@dapp/components/Shared/AmountBox';
import usePrepareSwap from '@dapp/hooks/swap/usePrepareSwap';
import Localization from '@dapp/localization';
import PageLayout from '@dapp/components/Shared/PageLayout';
import ApproveTokenAllowance from '@dapp/components/Shared/ApproveTokenAllowance';
import { useAppContext } from '@dapp/context/AppContext';
import useChain from '@dapp/hooks/chain/useChain';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import useGetTokenAllowance from '@dapp/hooks/tokens/useGetTokenAllowance';
import { useXfai } from '@dapp/context/XfaiProvider';
import { BigNumber, ethers } from 'ethers';
import { BASISPOINT_MAX, basisPointToPercent } from '@xfai-labs/sdk';
import { useMemo } from 'react';
import { calculateSensibleMax } from '@dapp/utils/trade';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import MainConfig from '@dapp/config/MainConfig';
import WalletButton from '@dapp/components/WalletButton';
import SwapDetails from '@dapp/components/SwapDetails';
import { AnimatePresence } from 'framer-motion';

const priceImpactCalc = (
  tokenInFiat: BigNumber | undefined,
  tokenOutFiat: BigNumber | undefined,
): [undefined | 'warning' | 'error', undefined | string] => {
  if (!tokenOutFiat || !tokenInFiat) return [undefined, undefined];
  if (tokenOutFiat.eq(0)) return [undefined, undefined];
  const change = tokenOutFiat.sub(tokenInFiat).mul(BASISPOINT_MAX).div(tokenInFiat.add(1));
  const percentChange = `(${basisPointToPercent(change)}%)`;
  if (change.gte(-300)) return [undefined, percentChange];

  if (change.gt(-1000)) return ['warning', percentChange];

  return ['error', percentChange];
};

const Swap = () => {
  const xfai = useXfai();
  const { slippage, web3IsLoading } = useAppContext();
  const chain = useChain();
  const isLoading = web3IsLoading || !chain;
  const { showSelectToken, showModal, showSettings } = useGlobalModalContext();

  const { tokenIn, tokenOut, setTokenIn, setTokenOut, swapTokenOrder, trade } = usePrepareSwap({
    defaultTokenIn: xfai.nativeToken,
  });

  const { data: tokenInAllowancePure, isSuccess: tokenInAllowanceSuccess } = useGetTokenAllowance(
    tokenIn.token,
  );

  const tokenInAllowance = trade?.wethSwap ? ethers.constants.MaxUint256 : tokenInAllowancePure;

  const tokenInFiatValue = useFiatValue(tokenIn.token);
  const tokenOutFiatValue = useFiatValue(tokenOut.token);

  const [tokenInFiat, tokenOutFiat] = useMemo(
    () => [tokenInFiatValue(tokenIn.amount), tokenOutFiatValue(tokenOut.amount)],
    [tokenIn.amount, tokenInFiatValue, tokenOut.amount, tokenOutFiatValue],
  );

  const [priceImpactSeverity, priceImpact] = useMemo(
    () => priceImpactCalc(tokenInFiat, tokenOutFiat),
    [tokenInFiat, tokenOutFiat],
  );

  const isError = !!tokenOut.error || !!tokenIn.error;

  return (
    <PageLayout.Page pageKey="swap" isLoading={isLoading}>
      <PageMetaTags title={Localization.Swap.PageInfo.TITLE} />
      <PageLayout.Title
        title={Localization.Swap.PageInfo.TITLE}
        highlightedWords={[Localization.Swap.PageInfo.HIGHLIGHT_TITLE]}
        description={Localization.Swap.PageInfo.DESCRIPTION}
      >
        <InlineLink target="_blank" href={MainConfig.SWAP_DOCUMENTATION_URL}>
          {Localization.Swap.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>

      <PageLayout.Group>
        <PageLayout.Card>
          <PageLayout.CardGroup>
            <FormTitle
              size="large"
              title={Localization.Swap.Label.SWAP}
              titleTooltip={Localization.Swap.Tooltip.TOOLTIP}
              buttonIcon={IconSliders}
              buttonText={`${basisPointToPercent(slippage)}% ${Localization.Label.SLIPPAGE}`}
              buttonOnClick={showSettings}
            />
            <AmountBox
              loading={isLoading}
              balance={tokenIn.balance}
              tokenSelectProps={{
                token: tokenIn.token,
                amountFiat: true,
                button: true,
                onClick: () =>
                  showSelectToken({
                    fetchBalances: true,
                    onToken: (token) => {
                      if (token.address === tokenOut.token?.address) {
                        swapTokenOrder();
                      } else {
                        setTokenIn(token);
                      }
                    },
                    selectedTokens: [tokenOut.token],
                  }),
              }}
              maxOnClick={() =>
                tokenIn.token &&
                tokenIn.setAmount(
                  tokenIn.balance && calculateSensibleMax(tokenIn.token, tokenIn.balance),
                )
              }
              maxDisabled={!tokenIn.balance || tokenIn.balance.eq(0)}
              setTokenAmount={tokenIn.setAmount}
              error={tokenIn.error}
              errorType="error"
              tokenAmount={tokenIn.amount}
              fiatValue={tokenInFiat}
            />

            <DivideContainer>
              <ButtonIcon
                size="large"
                icon={IconSwapArrows}
                bgColor="bg-60 hover:bg-cyan"
                color="fill-cyan hover:fill-white"
                hoverEffect="scaleUp"
                onClick={swapTokenOrder}
              />
            </DivideContainer>

            <AmountBox
              loading={isLoading}
              balance={tokenOut.balance}
              tokenSelectProps={{
                disabled: !tokenIn,
                token: tokenOut.token,
                amountFiat: true,
                button: true,
                onClick: () =>
                  showSelectToken({
                    fetchBalances: true,
                    onToken: (token) => {
                      if (token.address === tokenIn.token?.address) {
                        swapTokenOrder();
                      } else {
                        setTokenOut(token);
                      }
                    },
                    selectedTokens: [tokenIn.token],
                  }),
              }}
              setTokenAmount={tokenOut.setAmount}
              error={priceImpact || (!!tokenOut.error as true)}
              errorType={priceImpactSeverity}
              tokenAmount={tokenOut.amount}
              fiatValue={tokenOutFiat}
            />
          </PageLayout.CardGroup>

          <AnimatePresence>{trade && <SwapDetails swap={trade} refetch />}</AnimatePresence>

          {!xfai.hasWallet ? (
            <WalletButton contentButton />
          ) : tokenInAllowanceSuccess &&
            tokenInAllowance &&
            trade &&
            tokenInAllowance.lt(trade.tokenIn.amount) ? (
            <ApproveTokenAllowance token={trade.tokenIn.token} />
          ) : (
            <Button
              type="submit"
              size="xl"
              disabled={
                !trade || isError || !tokenInAllowance || tokenInAllowance.lt(trade.tokenIn.amount)
              }
              state={isError ? 'error' : undefined}
              onClick={() => {
                showModal('SwapModal', {
                  swap: trade!,
                  onCompletion(success) {
                    if (success) {
                      tokenIn.setAmount(undefined);
                      tokenOut.setAmount(undefined);
                      setTokenIn(xfai.nativeToken);
                      setTokenOut(undefined);
                    }
                  },
                });
              }}
            >
              {tokenIn.error ?? tokenOut.error ?? Localization.Swap.Button.SWAP}
            </Button>
          )}
        </PageLayout.Card>
      </PageLayout.Group>
    </PageLayout.Page>
  );
};

export default Swap;
