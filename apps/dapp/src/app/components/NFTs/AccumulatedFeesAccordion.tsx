import Localization from '@dapp/localization';
import PageLayout from '@dapp/components/Shared/PageLayout';
import {
  Spinner,
  Button,
  AccordionGroup,
  AccordionItem,
  Tooltip,
  FormTitle,
  IconArrowDown,
  IconExit,
  IconRoundInfo,
} from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import Token from '@dapp/components/Token';
import { getINFTTokenBalance, handleNativeToken, INFT } from '@xfai-labs/sdk';
import { useINFTTopTokenBalances } from '@dapp/hooks/inft/useINFTTopTokenBalances';
import useXfaiQuery from '@dapp/hooks/meta/useXfaiQuery';
import { Fragment, FunctionComponent, useState } from 'react';
import AccumulatedFees from '../Shared/AccumulatedFees';
import MainConfig from '@dapp/config/MainConfig';
import cs from 'classnames';
import { useINFTFees } from '@dapp/hooks/backend/inft/useInftFees';
import { toggleAmount } from '@dapp/utils/formatting';
import { useXfai } from '@dapp/context/XfaiProvider';
import useINFTState from '@dapp/hooks/inft/useINFTState';
import { BigNumber } from 'ethers';

const AccumulatedFeesAccordion: FunctionComponent<{
  inft: INFT;
  canHarvest: boolean;
}> = ({ inft, canHarvest }) => {
  const xfai = useXfai();
  const { data: accumulatedFees, isLoading } = useINFTTopTokenBalances(inft);
  const { showModal, showSelectToken } = useGlobalModalContext();
  const [selectedToken, setSelectedToken] = useState<TokenInfo | undefined>();
  const { data: nftState } = useINFTState();

  const {
    data: dailyFees,
    isLoading: dailyFeesAreLoading,
    isError: dailyFeesError,
  } = useINFTFees('day');
  const {
    data: weeklyFees,
    isLoading: weeklyFeesAreLoading,
    isError: weeklyFeesError,
  } = useINFTFees('week');

  const { data: selectedTokenAmount, isInitialLoading: selectedTokenIsLoading } = useXfaiQuery(
    ['selectedToken', selectedToken?.address],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (xfai) => getINFTTokenBalance(xfai, inft, selectedToken!),
    {
      enabled: !!selectedToken,
      onError: () => setSelectedToken(undefined),
      retry: 2,
      staleTime: 1000 * 5,
    },
  );

  if (isLoading || !accumulatedFees) {
    return (
      <div className="flex flex-col">
        <PageLayout.Card className="min-h-[15rem] items-center justify-center rounded-lg">
          <Spinner />
        </PageLayout.Card>
      </div>
    );
  }

  return (
    <div className="mt-2.5 flex flex-col gap-2.5 lg:gap-3.5">
      <div className="flex items-center gap-3">
        <h2 className="text-xl xl:text-2xl">{Localization.Label.ACCUMULATED_FEES}</h2>
        <a
          href={MainConfig.INFTS_HARVEST_DOCUMENTATION_URL}
          className={!MainConfig.INFTS_HARVEST_DOCUMENTATION_URL ? ' pointer-events-none' : ''}
          target="_blank"
          rel="noreferrer"
        >
          <IconRoundInfo
            className={cs(
              'h-4 w-4 transition-colors duration-100',
              !MainConfig.INFTS_HARVEST_DOCUMENTATION_URL
                ? 'fill-20'
                : 'fill-cyan hover:fill-cyan-dark',
            )}
          />
        </a>
      </div>
      <PageLayout.CardGroup className="!gap-1.5">
        <AccordionGroup>
          {accumulatedFees?.map(([token, balance]) => (
            <Fragment key={token.address}>
              <AccordionItem
                key={token.address}
                openSpace
                className="border-60/20 dark:border-60 rounded-lg border"
                header={
                  <div className="bg-60/50 hover:bg-60 group-[.open]/accordion-item:bg-60 flex flex-row items-center justify-between gap-2.5 px-2.5 py-2.5 transition-colors lg:gap-4 lg:px-4">
                    <Token.View token={token} amount={balance.amount} />
                    <div className="text-20 flex flex-row items-center gap-2.5 text-xs uppercase">
                      <span>{Localization.Liquidity.Manage.Button.MANAGE}</span>
                      <IconArrowDown className="fill-10 h-3 transition-transform group-[.open]/accordion-item:-rotate-180 lg:h-4" />
                    </div>
                  </div>
                }
              >
                <div className="bg-60/50 border-60/20 dark:border-60 flex flex-col gap-2.5 border-t p-2.5 lg:gap-4 lg:p-4">
                  <div className="flex flex-col gap-2.5">
                    <FormTitle
                      lightTitle
                      size="small"
                      title={Localization.INFTs.Label.HARVEST_LEFT}
                      titleTooltip={Localization.INFTs.Tooltip.HARVEST_LEFT}
                      value={`${
                        balance.totalShares
                          .mul(100 * 100 * 100)
                          .div(balance.totalShares.isZero() ? 1 : balance.totalShares)
                          .toNumber() /
                        (100 * 100)
                      }%`}
                    />
                    <FormTitle
                      lightTitle
                      size="small"
                      title={Localization.INFTs.Label.POOL_SHARE}
                      titleTooltip={Localization.INFTs.Tooltip.POOL_SHARE}
                      value={`${
                        balance.totalShares
                          .sub(balance.harvestedShares)
                          .mul(100 * 100 * 100)
                          .div(nftState?.shares ?? BigNumber.from(10).pow(18))
                          .toNumber() /
                        (100 * 100)
                      }%`}
                    />
                  </div>
                  <AccumulatedFees
                    title={`${token.symbol} ${Localization.Label.ACCUMULATED_FEES}`}
                    last24Hours={
                      dailyFees && dailyFees[handleNativeToken(xfai, token).address]
                        ? toggleAmount(
                            dailyFees[handleNativeToken(xfai, token).address].fiatValue
                              .mul(balance.totalShares.sub(balance.harvestedShares))
                              .div(nftState?.shares ?? BigNumber.from(10).pow(18)),
                            'fiat',
                          )
                        : undefined
                    }
                    last7Days={
                      weeklyFees && weeklyFees[handleNativeToken(xfai, token).address]
                        ? toggleAmount(
                            weeklyFees[handleNativeToken(xfai, token).address].fiatValue
                              .mul(balance.totalShares.sub(balance.harvestedShares))
                              .div(nftState?.shares ?? BigNumber.from(10)),
                            'fiat',
                          )
                        : undefined
                    }
                  />
                  <Tooltip
                    className="grow"
                    text={
                      !canHarvest
                        ? Localization.INFTs.Tooltip.HARVEST_AVAILABILITY
                        : balance.amount.isZero()
                        ? Localization.INFTs.Tooltip.NO_FEES_TO_HARVEST
                        : undefined
                    }
                  >
                    <Button
                      size="medium"
                      className="grow"
                      bgColor="bg-cyan hover:bg-cyan-dark"
                      disabled={!canHarvest || balance.amount.isZero()}
                      onClick={() => {
                        showModal('INFTHarvestModal', {
                          inft,
                          token,
                        });
                      }}
                    >
                      {`${Localization.INFTs.Button.HARVEST} ${token.symbol}`}
                    </Button>
                  </Tooltip>
                </div>
              </AccordionItem>
            </Fragment>
          ))}
        </AccordionGroup>
      </PageLayout.CardGroup>
      <PageLayout.Card className="rounded-lg !p-3 xl:!p-3.5 2xl:!p-4">
        <div className="flex flex-row items-center justify-between">
          <Token.Select
            button={false}
            loading={selectedTokenIsLoading}
            token={selectedToken}
            amount={selectedTokenAmount?.amount}
            className="bg-60 hover:!bg-50"
            onClick={() =>
              showSelectToken({
                onToken: (token) => {
                  setSelectedToken(token);
                },
                fetchBalances: false,
                filter: (token) => !accumulatedFees.map(([t]) => t.address).includes(token.address),
                includeNativeTokens: 'native',
              })
            }
          />
          {selectedToken && (
            <div className="text-20 flex flex-row items-center gap-2.5 text-xs uppercase">
              <IconExit
                className="fill-10 h-3 cursor-pointer"
                onClick={() => {
                  setSelectedToken(undefined);
                }}
              />
            </div>
          )}
        </div>
        {selectedToken && selectedTokenAmount && (
          <div className="flex flex-col gap-2.5 lg:gap-4">
            <div className="flex flex-col gap-2.5">
              <FormTitle
                lightTitle
                size="small"
                title={Localization.INFTs.Label.HARVEST_LEFT}
                titleTooltip={Localization.INFTs.Tooltip.HARVEST_LEFT}
                value={`${
                  selectedTokenAmount.totalShares
                    .sub(selectedTokenAmount.harvestedShares)
                    .mul(10000)
                    .div(
                      selectedTokenAmount.totalShares.isZero()
                        ? 1
                        : selectedTokenAmount.totalShares,
                    )
                    .toNumber() / 100
                }%`}
              />
              <FormTitle
                lightTitle
                size="small"
                title={Localization.INFTs.Label.POOL_SHARE}
                titleTooltip={Localization.INFTs.Tooltip.POOL_SHARE}
                value={`${
                  selectedTokenAmount.totalShares
                    .sub(selectedTokenAmount.harvestedShares)
                    .mul(100 * 100 * 100)
                    .div(nftState?.shares ?? BigNumber.from(10).pow(18))
                    .toNumber() /
                  (100 * 100)
                }%`}
              />
            </div>
            <AccumulatedFees
              title={`${selectedToken.symbol} ${Localization.Label.ACCUMULATED_FEES}`}
              last24Hours={
                dailyFees && dailyFees[handleNativeToken(xfai, selectedToken).address]
                  ? toggleAmount(
                      dailyFees[handleNativeToken(xfai, selectedToken).address].fiatValue
                        .mul(
                          selectedTokenAmount.totalShares.sub(selectedTokenAmount.harvestedShares),
                        )
                        .div(nftState?.shares ?? BigNumber.from(10).pow(18)),
                      'fiat',
                    )
                  : undefined
              }
              last7Days={
                weeklyFees && weeklyFees[handleNativeToken(xfai, selectedToken).address]
                  ? toggleAmount(
                      weeklyFees[handleNativeToken(xfai, selectedToken).address]?.fiatValue
                        .mul(
                          selectedTokenAmount.totalShares.sub(selectedTokenAmount.harvestedShares),
                        )
                        .div(nftState?.shares ?? BigNumber.from(10).pow(18)),
                      'fiat',
                    )
                  : undefined
              }
            />

            <Tooltip
              className="grow"
              text={
                !canHarvest
                  ? Localization.INFTs.Tooltip.HARVEST_AVAILABILITY
                  : selectedTokenAmount?.amount.isZero()
                  ? Localization.INFTs.Tooltip.NO_FEES_TO_HARVEST
                  : undefined
              }
            >
              <Button
                className="grow"
                size="medium"
                bgColor="bg-cyan hover:bg-cyan-dark"
                loading={selectedTokenIsLoading}
                disabled={
                  !canHarvest ||
                  !selectedToken ||
                  selectedTokenIsLoading ||
                  !selectedTokenAmount ||
                  selectedTokenAmount?.amount.isZero()
                }
                onClick={() => {
                  selectedToken &&
                    showModal('INFTHarvestModal', {
                      inft,
                      token: selectedToken,
                    });
                }}
              >
                {`${Localization.INFTs.Button.HARVEST} ${selectedToken.symbol}`}
              </Button>
            </Tooltip>
          </div>
        )}
      </PageLayout.Card>
    </div>
  );
};

export default AccumulatedFeesAccordion;
