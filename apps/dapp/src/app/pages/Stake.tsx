import { useEffect, useMemo } from 'react';
import {
  Button,
  ButtonIcon,
  IconSliders,
  FormTitle,
  IconExit,
  TabStake,
  InlineLink,
} from '@xfai-labs/ui-components';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import Localization from '@dapp/localization';
import AmountBox from '@dapp/components/Shared/AmountBox';
import PageLayout from '@dapp/components/Shared/PageLayout';
import usePrepareStake from '@dapp/hooks/stake/usePrepareStake';
import useChain from '@dapp/hooks/chain/useChain';
import { INFT } from '@xfai-labs/sdk';
import { useAppContext } from '@dapp/context/AppContext';
import ApproveTokenAllowance from '@dapp/components/Shared/ApproveTokenAllowance';
import PageMetaTags from '@dapp/components/Shared/PageTags';
import INFTThumbnail from '@dapp/components/NFTs/Thumbnail';
import { AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useXfai } from '@dapp/context/XfaiProvider';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { calculateSensibleMax } from '@dapp/utils/trade';
import { useINFTFees } from '@dapp/hooks/backend/inft/useInftFees';
import { BigNumber } from 'ethers';
import MainConfig from '@dapp/config/MainConfig';
import useGetTokenINFTAllowance from '@dapp/hooks/tokens/useGetTokenINFTAllowance';
import { useLocalTransactions } from '@dapp/context/LocalTransactions';
import WalletButton from '@dapp/components/WalletButton';
import StakeDetails from '@dapp/components/StakeDetails';
// import StakeDetails from '@dapp/components/StakeDetails';

const StakePage = () => {
  const xfai = useXfai();
  const navigate = useNavigate();
  const { inftId } = useParams();
  const inftObject = useMemo(() => (inftId ? INFT(Number(inftId)) : undefined), [inftId]);

  const { showModal, showSettings } = useGlobalModalContext();
  const { web3IsLoading } = useAppContext();
  const chain = useChain();

  const { data: fees, isLoading: feesAreLoading, isError: feesError } = useINFTFees('week');

  const isLoading = web3IsLoading || !chain;

  const { removeLocalStake } = useLocalTransactions().stake;
  const {
    error,
    isReady,
    tokenIn,
    setInft,
    inft,
    stake,
    isLoading: stakeIsLoading,
  } = usePrepareStake({
    inft: inftObject,
  });

  const yearlyFiatReturn = useMemo(() => {
    if (!fees || !stake) return undefined;

    const usdFees = Object.values(fees).reduce((c, p) => c.add(p.fiatValue), BigNumber.from(0));

    const WEEKS_IN_YEAR = 54;
    return usdFees
      .mul(stake.minShares)
      .mul(WEEKS_IN_YEAR)
      .div(stake.totalShares.add(stake.minShares).add(1));
  }, [fees, stake]);

  const tokenInFiatValue = useFiatValue(xfai.underlyingToken);

  const fiatValue = useMemo(
    () => tokenInFiatValue(tokenIn.amount),
    [tokenInFiatValue, tokenIn.amount],
  );

  const apr = useMemo(() => {
    if (!fiatValue || !yearlyFiatReturn) return;
    return (yearlyFiatReturn.mul(100000).div(fiatValue.add(1)).toNumber() / 1000).toString();
  }, [fiatValue, yearlyFiatReturn]);

  const { data: tokenInAllowance, isSuccess: tokenInAllowanceSuccess } = useGetTokenINFTAllowance(
    xfai.underlyingToken,
  );

  useEffect(() => {
    navigate('/stake');
  }, [chain?.chainId, navigate]);

  return (
    <PageLayout.Page pageKey="stake" isLoading={isLoading}>
      <PageMetaTags title={Localization.InfinityStake.PageInfo.TITLE} />
      <PageLayout.Title
        title={
          !inft ? Localization.InfinityStake.PageInfo.TITLE : Localization.Boost.PageInfo.TITLE
        }
        highlightedWords={[
          Localization.InfinityStake.PageInfo.HIGHLIGHT_TITLE,
          Localization.Boost.PageInfo.HIGHLIGHT_TITLE,
        ]}
        description={Localization.InfinityStake.PageInfo.DESCRIPTION}
        mobileDescription
      >
        <InlineLink target="_blank" href={MainConfig.STAKE_DOCUMENTATION_URL}>
          {Localization.InfinityStake.PageInfo.DOCUMENTATION_BUTTON}
        </InlineLink>
      </PageLayout.Title>

      <PageLayout.Group>
        <AnimatePresence>
          {inft && (
            <PageLayout.Card>
              <PageLayout.CardGroup>
                <INFTThumbnail.Modal loading={isLoading} inft={inft} size="medium" />

                <ButtonIcon
                  className="absolute right-3 top-1/2 -translate-y-1/2 lg:right-5"
                  size="small"
                  bgColor="bg-50 hover:bg-30"
                  color="fill-10 hover:fill-white-blue"
                  icon={IconExit}
                  onClick={() => {
                    setInft(undefined);
                    navigate('/stake');
                  }}
                />
              </PageLayout.CardGroup>
            </PageLayout.Card>
          )}
        </AnimatePresence>
        <PageLayout.Card>
          <PageLayout.CardGroup>
            <FormTitle
              size="large"
              title={
                !inft
                  ? Localization.InfinityStake.Label.INFINITY_STAKING
                  : Localization.Boost.Label.BOOST_AMOUNT
              }
              titleTooltip={Localization.InfinityStake.Tooltip.INFINITY_STAKING}
              buttonIcon={IconSliders}
              buttonOnClick={() => {
                showSettings();
              }}
            />
            <AmountBox
              loading={isLoading}
              balance={tokenIn.balance}
              setTokenAmount={tokenIn?.setAmount}
              tokenAmount={tokenIn?.amount}
              fiatValue={fiatValue}
              error={error}
              errorType={'error'}
              maxOnClick={() =>
                tokenIn.setAmount(
                  tokenIn.balance && calculateSensibleMax(xfai.underlyingToken, tokenIn.balance),
                )
              }
              maxDisabled={!tokenIn.balance || tokenIn.balance.eq(0)}
              tokenSelect={false}
              tokenSelectProps={{
                token: xfai.underlyingToken,
                amountFiat: true,
                button: true,
                onClick: () => null,
              }}
            />
          </PageLayout.CardGroup>
          <AnimatePresence>
            {fiatValue && !feesError && (
              <PageLayout.CardDetail
                icon={TabStake}
                label={Localization.InfinityStake.Label.ESTIMATED_APR}
                value={yearlyFiatReturn ? `${apr}%` : undefined}
                tooltip={Localization.InfinityStake.Tooltip.ESTIMATED_APR}
                loading={feesAreLoading}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>{stake && <StakeDetails stake={stake} />}</AnimatePresence>
          {!xfai.hasWallet ? (
            <WalletButton contentButton />
          ) : tokenInAllowanceSuccess &&
            stake &&
            tokenInAllowance &&
            tokenInAllowance.lt(stake.amount) &&
            isReady &&
            !error ? (
            <ApproveTokenAllowance inftPeriphery token={xfai.underlyingToken} />
          ) : (
            <Button
              type="submit"
              icon={!inft ? TabStake : undefined}
              loading={stakeIsLoading}
              disabled={
                !isReady ||
                !!error ||
                !stake ||
                !tokenInAllowance ||
                tokenInAllowance.lt(stake.amount)
              }
              size="xl"
              state={error ? 'error' : 'normal'}
              onClick={() =>
                showModal('StakeModal', {
                  stake: stake!,
                  apr,
                  onCompletion(success) {
                    if (success) {
                      removeLocalStake();
                      navigate(`/inft${inft ? `/view/${inft.id}` : ''}`);
                    }
                  },
                })
              }
            >
              {!inft ? Localization.InfinityStake.Button.STAKE : Localization.Boost.Button.BOOST}
            </Button>
          )}
        </PageLayout.Card>
      </PageLayout.Group>
    </PageLayout.Page>
  );
};

export default StakePage;
