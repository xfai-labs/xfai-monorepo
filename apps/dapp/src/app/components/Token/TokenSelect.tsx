import {
  TokenUnknown,
  Button,
  IconSelectArrows,
  IconTriangle,
  SkeletonWrapper,
  Tooltip,
  IconImported,
} from '@xfai-labs/ui-components';
import cs from 'classnames';
import BaseTokenProps from './BaseTokenProps';
import { toggleAmount } from '@dapp/utils/formatting';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { HTMLProps, FunctionComponent } from 'react';
import Localization from '@dapp/localization';

export type TokenSelectProps = {
  button?: boolean;
} & BaseTokenProps &
  Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type' | 'ref'>;

export const TokenSelect: FunctionComponent<TokenSelectProps> = ({
  token,
  button = true,
  amount,
  amountFiat,
  loading,
  className,
  ...props
}) => {
  const fiatValue = useFiatValue(token);

  const classNames = cs(
    'group/token',
    'flex items-center justify-start leading-none',
    'gap-2.5 py-1.5 px-1.5 pr-2.5 bg-50 hover:bg-50/50 rounded-lg hover:rounded-xl transition-[background-color]',
    { 'bg-50/50': loading },
    className,
  );

  if (button && !token) {
    return (
      <Button
        disabled={loading}
        loading={loading}
        size="medium"
        bgColor="bg-cyan hover:bg-cyan-dark"
        className="uppercase"
        {...props}
      >
        {Localization.Button.SELECT_TOKEN}
      </Button>
    );
  }

  if (loading) {
    return (
      <button className={classNames} disabled type="button" {...props}>
        <figure className="bg-black-white m-0 h-9 w-9 shrink-0 overflow-hidden rounded-full 2xl:h-10 2xl:w-10">
          <SkeletonWrapper className="rounded-full">
            <TokenUnknown className="aspect-square h-full w-full" />
          </SkeletonWrapper>
        </figure>
        <figcaption className="flex flex-col items-start justify-center gap-0.5 2xl:gap-1">
          <div
            className={cs(
              'flex items-center gap-1.5',
              !amount ? 'text-white-blue 2xl:text-md text-base' : 'text-10 text-xsm font-medium',
            )}
          >
            <SkeletonWrapper>
              <h5 className={cs('!leading-none', !amount ? 'text-white-blue' : 'text-5')}>XFIT</h5>
            </SkeletonWrapper>
          </div>
          <SkeletonWrapper>
            <span
              className={cs(
                'text-white-blue whitespace-nowrap !leading-none',
                !amount ? 'text-xs' : 'text-base lg:text-lg',
              )}
            >
              $0.51512
            </span>
          </SkeletonWrapper>
        </figcaption>
        <IconSelectArrows className="fill-30 h-3 w-3 overflow-visible lg:h-4 lg:w-4" />
      </button>
    );
  }

  return (
    <button className={classNames} type="button" {...props}>
      <figure className="bg-black-white m-0 h-9 w-9 shrink-0 overflow-hidden rounded-full 2xl:h-10 2xl:w-10">
        {token?.logoURI ? (
          <img src={token.logoURI} alt={token.name} className="h-full w-full" />
        ) : (
          <TokenUnknown className="aspect-square h-full w-full" />
        )}
      </figure>
      <figcaption className="flex flex-col items-start justify-center gap-0.5 2xl:gap-1">
        <div
          className={cs(
            'flex items-center gap-1.5',
            !amount ? 'text-white-blue 2xl:text-md text-base' : 'text-10 text-xsm font-medium',
          )}
        >
          <h5 className={cs('!leading-none', !amount ? 'text-white-blue' : 'text-5')}>
            {token ? token.symbol : Localization.Button.SELECT}
          </h5>
          {token?.tags?.includes('extended') && (
            <Tooltip
              className="break-all !text-xs"
              offset={[1, -8]}
              placement="top"
              text={Localization.Message.EXTENDED_LIST_TOKEN_WARNING}
            >
              <IconTriangle className="h-2.5 w-2.5 fill-orange-500" />
            </Tooltip>
          )}
          {token?.tags?.includes('imported') && (
            <Tooltip
              className="break-all !text-xs"
              offset={[1, -8]}
              placement="top"
              text={Localization.Label.IMPORTED_TOKEN}
            >
              <IconImported className="h-2.5 w-2.5 fill-orange-500" />
            </Tooltip>
          )}
        </div>
        {amountFiat && (
          <span className="text-10 text-xs !leading-none">
            {toggleAmount(fiatValue('unit'), 'fiat', { prefix: '$' })}
          </span>
        )}
        {token && amount && (
          <span className="text-white-blue whitespace-nowrap text-base !leading-none 2xl:text-lg">
            {toggleAmount(amount, token)}
          </span>
        )}
      </figcaption>
      {props.onClick && (
        <IconSelectArrows
          className={cs(
            'fill-cyan h-3 w-3 overflow-visible lg:h-4 lg:w-4 [&>*]:transition-transform',
            'group-hover/token:[&>.arrow-bottom]:translate-y-2.5 group-hover/token:[&>.arrow-top]:-translate-y-2.5',
          )}
        />
      )}
    </button>
  );
};
