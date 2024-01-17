import cs from 'classnames';
import BaseTokenProps from './BaseTokenProps';
import {
  IconImported,
  IconTriangle,
  SkeletonWrapper,
  TokenUnknown,
  Tooltip,
} from '@xfai-labs/ui-components';
import { toggleAmount } from '@dapp/utils/formatting';
import { HTMLProps, FunctionComponent } from 'react';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import Localization from '@dapp/localization';

type TokenViewProps = {
  name?: boolean;
} & BaseTokenProps &
  Pick<HTMLProps<HTMLDivElement>, 'className'>;

export const TokenView: FunctionComponent<TokenViewProps> = ({
  token,
  amount,
  amountFiat,
  name,
  loading,
  className,
}) => {
  const fiatValue = useFiatValue(amountFiat ? token : undefined);

  const classNames = cs(
    'group/token',
    'flex items-center justify-start gap-2.5 py-1.5 leading-none',
    className,
  );

  if (loading || !token) {
    return (
      <div className={classNames}>
        <figure className="bg-black-white m-0 h-9 w-9 shrink-0 overflow-hidden rounded-full lg:h-10 lg:w-10">
          <SkeletonWrapper className="rounded-full">
            <TokenUnknown className="aspect-square w-full" />
          </SkeletonWrapper>
        </figure>
        <figcaption className="flex flex-col items-start justify-center gap-0.5 md:gap-1">
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
                'text-white-blue whitespace-nowrap leading-none',
                !amount ? 'text-xs' : 'text-base lg:text-lg',
              )}
            >
              $0.51512
            </span>
          </SkeletonWrapper>
        </figcaption>
      </div>
    );
  }

  return (
    <div className={classNames}>
      <figure className="bg-black-white m-0 h-9 w-9 shrink-0 overflow-hidden rounded-full 2xl:h-10 2xl:w-10">
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.name} className="h-full w-full" />
        ) : (
          <TokenUnknown className="aspect-square w-full" />
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
            {token.symbol}
          </h5>
          {token.tags?.includes('extended') && (
            <Tooltip
              className="break-all !text-xs"
              offset={[1, -8]}
              placement="top"
              text={Localization.Message.EXTENDED_LIST_TOKEN_WARNING}
            >
              <IconTriangle className="h-2.5 w-2.5 fill-orange-500" />
            </Tooltip>
          )}
          {token.tags?.includes('imported') && (
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
        {name && !amount && (
          <span className="text-10 whitespace-nowrap text-xs !leading-none 2xl:text-sm">
            {token.name}
          </span>
        )}
        {amountFiat && (
          <span className="text-10 text-xs !leading-none">
            {toggleAmount(fiatValue('unit'), 'fiat', { prefix: '$' })}
          </span>
        )}
        {amount && (
          <span className="text-white-blue whitespace-nowrap text-base !leading-none 2xl:text-lg">
            {toggleAmount(amount, token)}
          </span>
        )}
      </figcaption>
    </div>
  );
};
