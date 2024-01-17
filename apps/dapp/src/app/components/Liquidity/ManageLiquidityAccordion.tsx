import cs from 'classnames';
import {
  Button,
  FormTitle,
  IconArrowDown,
  IconEyeCrossed,
  IconExternalLink,
} from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import { BigNumber } from 'ethers';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { toggleAmount } from '@dapp/utils/formatting';
import Token from '@dapp/components/Token';
import { motion, AnimatePresence } from 'framer-motion';
import Localization from '@dapp/localization';
import { useMemo } from 'react';
import AccumulatedFees from '../Shared/AccumulatedFees';
import { useXfai } from '@dapp/context/XfaiProvider';
import { useINFTFees } from '@dapp/hooks/backend/inft/useInftFees';
import { handleNativeToken } from '@xfai-labs/sdk';
import useGetExplorerLink from '@dapp/hooks/chain/useGetExplorerLink';

type ManageLiquidityTriggerProps = {
  token: TokenInfo;
  className?: string;
};

export const ManageLiquidityTrigger = ({ token, className }: ManageLiquidityTriggerProps) => {
  const getBlockExplorerLink = useGetExplorerLink();
  const explorerLink = useMemo(
    () => getBlockExplorerLink(token.address, 'token2pool'),
    [getBlockExplorerLink, token.address],
  );
  return (
    <div
      className={cs(
        'flex flex-row items-center justify-between gap-2.5 px-2.5 py-2.5 lg:gap-4 lg:px-4',
        'bg-60/50 hover:bg-60 group-[.open]/accordion-item:bg-60 transition-colors',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Token.View token={token} />
        {explorerLink && (
          <a href={explorerLink} className="block pb-0.5" target="_blank" rel="noreferrer">
            <IconExternalLink className="fill-cyan hover:fill-cyan-dark h-3 w-3" />
          </a>
        )}
      </div>
      <div className="text-20 flex flex-row items-center gap-2.5 text-xs uppercase">
        <span>{Localization.Liquidity.Manage.Button.MANAGE}</span>
        <IconArrowDown className="fill-10 h-3 transition-transform group-[.open]/accordion-item:-rotate-180 lg:h-4" />
      </div>
    </div>
  );
};

type ManageLiquidityContentProps = {
  className?: string;
  token: TokenInfo;
  balance: BigNumber;
  poolTokenBalance: BigNumber;
  totalLiquidity: BigNumber;
  removeOnClick: () => void;
  addOnClick: () => void;
  hidePoolOnClick?: () => void;
};

export const ManageLiquidityContent = ({
  token,
  balance,
  poolTokenBalance,
  totalLiquidity,
  removeOnClick,
  addOnClick,
  hidePoolOnClick,
  className,
}: ManageLiquidityContentProps) => {
  const usdFiat = useFiatValue(token);
  const xfai = useXfai();

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

  const usdBalance = usdFiat(balance.mul(2).mul(poolTokenBalance).div(totalLiquidity.add(1)));
  const totalBalance = usdFiat(poolTokenBalance.mul(2));

  const poolShare = useMemo(
    () => balance.mul(10000).div(totalLiquidity.add(1)).div(100),
    [balance, totalLiquidity],
  );

  const getBlockExplorerLink = useGetExplorerLink();
  const explorerLink = useMemo(
    () => getBlockExplorerLink(token.address, 'token2pool'),
    [getBlockExplorerLink, token.address],
  );

  return (
    <AnimatePresence>
      <motion.div
        className={cs(
          'bg-60/50 border-60/20 dark:border-60 flex flex-col gap-2.5 border-t p-2.5 lg:gap-4 lg:p-4',
          className,
        )}
      >
        <div className="flex flex-col gap-2.5">
          <FormTitle
            lightTitle
            size="small"
            title={Localization.Liquidity.Label.POOL_SHARE}
            titleTooltip={Localization.Liquidity.Manage.Tooltip.POOL_SHARE}
            skeleton={!usdBalance}
            value={`${
              poolShare.isZero() && balance.gt(0) ? '< 0.01' : poolShare.toNumber().toFixed(2)
            }%`}
          />
          <FormTitle
            lightTitle
            size="small"
            title={Localization.Liquidity.Add.Label.YOUR_TOTAL_LIQUIDITY}
            titleTooltip={Localization.Liquidity.Add.Tooltip.YOUR_TOTAL_LIQUIDITY}
            skeleton={!usdBalance}
            value={`${toggleAmount(usdBalance, 'fiat', { prefix: '$ ' })}`}
          />
          <FormTitle
            lightTitle
            size="small"
            title={Localization.Liquidity.Add.Label.TOTAL_VALUE_LOCKED}
            titleTooltip={Localization.Liquidity.Add.Tooltip.TOTAL_VALUE_LOCKED}
            skeleton={!totalBalance}
            value={`${toggleAmount(totalBalance, 'fiat', { prefix: '$ ' })}`}
          />
        </div>
        {!dailyFeesError && !weeklyFeesError && (
          <AccumulatedFees
            last24Hours={
              dailyFees && xfai
                ? toggleAmount(
                    dailyFees[handleNativeToken(xfai, token)?.address]?.fiatValue
                      .mul(balance)
                      .div(totalLiquidity.add(1)),
                    'fiat',
                  )
                : undefined
            }
            last7Days={
              weeklyFees && xfai
                ? toggleAmount(
                    weeklyFees[handleNativeToken(xfai, token)?.address]?.fiatValue
                      .mul(balance)
                      .div(totalLiquidity.add(1)),
                    'fiat',
                  )
                : undefined
            }
          />
        )}
        <div className="flex flex-row gap-2.5">
          <Button
            size="medium"
            bgColor="bg-50 hover:bg-40"
            color="text-10 hover:text-5"
            disabled={balance.isZero()}
            onClick={removeOnClick}
          >
            {Localization.Liquidity.Manage.Button.REDEEM}
          </Button>
          <Button size="medium" className="flex-grow" onClick={addOnClick}>
            {Localization.Liquidity.Manage.Button.ADD} {token.symbol}{' '}
            {Localization.Liquidity.Manage.Button.LIQUIDITY}
          </Button>
        </div>
        {hidePoolOnClick && (
          <div className={cs('flex', !explorerLink ? 'justify-end' : 'justify-between')}>
            {explorerLink && (
              <a
                href={explorerLink}
                className="group/button text-10 hover:text-5 flex items-center gap-1.5 text-xs transition-colors duration-75"
                target="_blank"
                rel="noreferrer"
              >
                <IconExternalLink className="fill-cyan h-3 w-3 transition-colors duration-75" />
                {Localization.Liquidity.Manage.Button.BLOCK_EXPLORER}
              </a>
            )}
            <button
              className="group/button text-10 hover:text-5 flex items-center gap-1.5 text-xs transition-colors duration-75"
              onClick={hidePoolOnClick}
            >
              <IconEyeCrossed className="group-hover/button:fill-10 fill-20 h-4 w-4 transition-colors duration-75" />
              {Localization.Liquidity.Manage.Button.HIDE_POOL}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
