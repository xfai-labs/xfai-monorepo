import { NavLink, useLocation } from 'react-router-dom';
import PageLayout from '@dapp/components/Shared/PageLayout';
import AmountBox from '@dapp/components/Shared/AmountBox';

import {
  Button,
  FormTitle,
  IconArrowRight,
  IconSliders,
  InlineLink,
  IconPoolShare,
} from '@xfai-labs/ui-components';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { useAppContext } from '@dapp/context/AppContext';
import usePrepareLiquidityAdd from '@dapp/hooks/liquidity/usePrepareLiquidityAdd';
import Localization from '@dapp/localization';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import { useXfai } from '@dapp/context/XfaiProvider';
import useGetTokenAllowance from '@dapp/hooks/tokens/useGetTokenAllowance';
import ApproveTokenAllowance from '@dapp/components/Shared/ApproveTokenAllowance';
import { calculateSensibleMax } from '@dapp/utils/trade';
import MainConfig from '@dapp/config/MainConfig';
import { AnimatePresence } from 'framer-motion';
import WalletButton from '@dapp/components/WalletButton';
import AddLiquidityGas from '@dapp/components/Liquidity/AddLiquidityGas';
import { isSharedToken } from '@xfai-labs/sdk';

const AddLiquidityPage = () => {
  const { state } = useLocation();
  const { web3IsLoading: isLoading } = useAppContext();
  const { showSelectToken, showModal, showSettings } = useGlobalModalContext();
  const xfai = useXfai();

  const { target, eth, error, poolShare, setTarget, addLiquidity, quoteType, isUsingCoingecko } =
    usePrepareLiquidityAdd({
      defaultTarget: xfai.underlyingToken,
      preselectedTarget: state?.token,
    });

  const { data: targetAllowance } = useGetTokenAllowance(target.token);

  const allowanceValid =
    targetAllowance && addLiquidity && targetAllowance.gte(addLiquidity.target.amount);

  const isError = !!error || !!target.error || !!eth.error;

  return (
    <PageLayout.Page pageKey="addLiquidity" isLoading={isLoading}>
      <PageMetaTags title={Localization.Liquidity.Add.PageInfo.TITLE} />
      <PageLayout.Title
        title={Localization.Liquidity.Add.PageInfo.TITLE}
        highlightedWords={[Localization.Liquidity.Add.PageInfo.HIGHLIGHT_TITLE]}
        description={Localization.Liquidity.Add.PageInfo.DESCRIPTION}
      >
        <InlineLink target="_blank" href={MainConfig.ADD_LIQUIDITY_DOCUMENTATION_URL}>
          {Localization.Liquidity.Add.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>

      <PageLayout.Group>
        <PageLayout.Card>
          <PageLayout.CardGroup>
            <FormTitle
              skeleton={isLoading}
              size="large"
              title={Localization.Liquidity.Add.Label.SELECT_PRIMARY_TOKEN}
              titleTooltip={Localization.Liquidity.Add.Tooltip.SELECT_PRIMARY_TOKEN}
              buttonIcon={IconSliders}
              buttonOnClick={showSettings}
            />
            <AmountBox
              errorType="error"
              error={target.error}
              loading={isLoading}
              balance={target.balance}
              maxOnClick={() =>
                target.token &&
                target.setAmount(
                  target.balance && calculateSensibleMax(target.token, target.balance),
                )
              }
              maxDisabled={!target.balance || target.balance.eq(0)}
              tokenSelectProps={{
                token: target.token,
                amountFiat: true,
                button: true,
                onClick: () =>
                  showSelectToken({
                    needsLiquidityPool: false,
                    includeNativeTokens: 'native',
                    fetchBalances: true,
                    onToken: (token) => {
                      setTarget(token);
                    },
                    selectedTokens: [target.token],
                    filter: (token) => !isSharedToken(xfai, token),
                  }),
              }}
              setTokenAmount={target.setAmount}
              tokenAmount={target.amount}
              isUsingCoinGecko={
                isUsingCoingecko && target.amount && quoteType !== 'Token' ? true : false
              }
            />
          </PageLayout.CardGroup>

          <AnimatePresence>
            {target.token && (
              <PageLayout.CardGroup
                key="secondaryToken"
                initial={{
                  height: 0,
                  opacity: 0,
                  overflow: 'hidden',
                }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  overflow: 'visible',
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  overflow: 'hidden',
                }}
                transition={{ duration: 0.15 }}
              >
                <AmountBox
                  loading={isLoading}
                  balance={eth.balance}
                  tokenSelect={false}
                  tokenSelectProps={{
                    token: eth.token,
                    amountFiat: true,
                    button: false,
                  }}
                  maxOnClick={() =>
                    eth.token &&
                    eth.setAmount(eth.balance ? calculateSensibleMax(eth.token, eth.balance) : '0')
                  }
                  maxDisabled={
                    target.token?.address === eth.token?.address ||
                    !eth.balance ||
                    eth.balance.eq(0)
                  }
                  setTokenAmount={eth.setAmount}
                  tokenAmount={eth.amount}
                  errorType="error"
                  error={eth.error}
                  isUsingCoinGecko={
                    isUsingCoingecko && eth.amount && quoteType !== 'ETH' ? true : false
                  }
                />
              </PageLayout.CardGroup>
            )}
          </AnimatePresence>
          {addLiquidity && (
            <PageLayout.CardDetail
              icon={IconPoolShare}
              label={Localization.Liquidity.Label.POOL_SHARE}
              value={`${poolShare}%`}
              tooltip={Localization.Liquidity.Add.Tooltip.POOL_SHARE}
              iconColor="fill-20"
              loading={isLoading}
            />
          )}
          {addLiquidity && <AddLiquidityGas addLiquidity={addLiquidity} />}

          {!xfai.hasWallet ? (
            <WalletButton contentButton />
          ) : addLiquidity && !isError && !isLoading && !allowanceValid ? (
            <ApproveTokenAllowance token={addLiquidity.target.token} />
          ) : (
            <Button
              type="submit"
              size="xl"
              disabled={isError || !addLiquidity || isLoading || !allowanceValid}
              onClick={() =>
                showModal('LiquidityAddModal', {
                  addLiquidity: addLiquidity!,
                  onCompletion(success) {
                    if (success) {
                      target.setAmount(undefined);
                      eth.setAmount(undefined);
                      setTarget(xfai.underlyingToken);
                    }
                  },
                })
              }
            >
              {error ? error : Localization.Liquidity.Add.Button.ADD_LIQUIDITY}
            </Button>
          )}
        </PageLayout.Card>
        <Button
          loading={isLoading}
          NavLink={NavLink}
          href="/liquidity/manage"
          size="manageLiquidity"
          bgColor="bg-70 hover:bg-60 border border-60/20 dark:border-60"
          disabledBgColor="bg-70 border border-60/20 dark:border-60"
          color="text-white-blue fill-10"
          disabledColor="text-white-blue fill-10"
          icon={IconArrowRight}
          iconPosition="right"
          spaceBetween
        >
          {Localization.Liquidity.Add.Button.MANAGE_LIQUIDITY}
        </Button>
      </PageLayout.Group>
    </PageLayout.Page>
  );
};

export default AddLiquidityPage;
