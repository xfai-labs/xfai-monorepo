/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ButtonIcon,
  Input,
  IconRoundPlus,
  IconWallet,
  CoinGeckoLogo,
} from '@xfai-labs/ui-components';
import cs from 'classnames';
import Localization from '@dapp/localization';
import Token from '@dapp/components/Token';
import { toggleAmount } from '@dapp/utils/formatting';
import { ComponentPropsWithoutRef, FC, HTMLAttributes } from 'react';
import { BigNumber } from 'ethers';
import { noop } from 'lodash';

type Props = {
  error?: string | true;
  errorType?: undefined | 'warning' | 'error';
  loading?: boolean;
  tokenSelect?: boolean;
  tokenSelectProps?: ComponentPropsWithoutRef<typeof Token.Select>;
  tokenAmount?: string;
  setTokenAmount?: (value: string | undefined) => void;
  isUsingCoinGecko?: boolean;
  inputDisabled?: boolean;
  balance?: BigNumber | false;
  maxDisabled?: boolean;
  maxOnClick?: () => void;
  className?: string;
  bottomLabel?: string;
  fiatValue?: BigNumber;
  walletIcon?: FC<HTMLAttributes<unknown>>;
};

const AmountBox = ({
  loading,
  balance,
  error,
  errorType,
  maxDisabled = false,
  maxOnClick,
  className = '',
  tokenAmount,
  setTokenAmount = noop,
  isUsingCoinGecko,
  inputDisabled,
  tokenSelect = true,
  tokenSelectProps,
  fiatValue,
  walletIcon = IconWallet,
}: Props) => {
  const classNames = cs(
    'bg-60/80 dark:bg-60 flex flex-col rounded-lg p-2 lg:p-2.5 xl:p-3 gap-2 lg:gap-2.5 xl:gap-3 border border-transparent dark:border-50',
    !tokenSelectProps?.token && '!p-2',
    className,
  );

  return (
    <div className={classNames}>
      <div
        className={cs(
          'z-[2] flex justify-between gap-2 lg:gap-2.5 xl:gap-3',
          tokenSelectProps?.button && '[&>*]:only:grow',
        )}
      >
        {tokenSelect ? (
          <Token.Select loading={loading} {...tokenSelectProps} />
        ) : (
          <Token.View
            loading={loading}
            token={tokenSelectProps?.token}
            amount={tokenSelectProps?.amount}
            amountFiat={tokenSelectProps?.amountFiat}
          />
        )}
        {tokenSelectProps?.token && (
          <Input.Amount
            name={`${tokenSelectProps.token.symbol}Amount`}
            maxDecimals={tokenSelectProps.token.decimals}
            setValue={setTokenAmount}
            disabled={!tokenSelectProps.token || loading || inputDisabled}
            value={tokenAmount}
            bottomLabel={fiatValue ? toggleAmount(fiatValue, 'fiat', { prefix: '$' }) : undefined}
            validationMessage={error === true ? undefined : error}
            validationType={errorType}
            loading={loading}
            inputTooltipMessage={
              isUsingCoinGecko ? Localization.Message.DATA_PROVIDED_BY_COINGECKO : undefined
            }
            inputTooltipIcon={isUsingCoinGecko ? CoinGeckoLogo : undefined}
          />
        )}
      </div>
      {tokenSelectProps?.token && (!!maxOnClick || balance !== false) && (
        <>
          <hr className="border-50 z-[1]" />
          <div className="z-[1] flex justify-between">
            {balance !== false && (
              <ButtonIcon
                skeleton={loading || !balance}
                disabled
                size="x-small"
                noSpace
                bgColor="bg-transparent"
                disabledColor="text-5 fill-20"
                icon={walletIcon}
              >
                {toggleAmount(balance, tokenSelectProps.token)} {tokenSelectProps.token.symbol}
              </ButtonIcon>
            )}
            {!!maxOnClick && (
              <ButtonIcon
                size="x-small"
                noSpace
                bgColor="bg-50"
                color="text-cyan fill-cyan hover:text-cyan-dark hover:fill-cyan-dark"
                className="uppercase only:ml-auto"
                skeleton={loading}
                icon={IconRoundPlus}
                disabled={maxDisabled}
                disabledColor="text-20 fill-20"
                onClick={maxOnClick}
              >
                {Localization.Button.MAX}
              </ButtonIcon>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AmountBox;
