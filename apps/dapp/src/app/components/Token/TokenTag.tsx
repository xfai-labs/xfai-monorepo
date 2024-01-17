import cs from 'classnames';
import BaseTokenProps from './BaseTokenProps';
import { TokenUnknown, SkeletonWrapper } from '@xfai-labs/ui-components';
import { HTMLProps, FunctionComponent } from 'react';

type TokenTagProps = BaseTokenProps & Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type' | 'ref'>;

export const TokenTag: FunctionComponent<TokenTagProps> = ({
  token,
  loading,
  className,
  ...props
}) => {
  const classNames = cs(
    'group/token',
    'flex items-center justify-start gap-2 py-[0.313rem] leading-none',
    'px-[0.313rem] pr-2 bg-50 hover:bg-40 rounded-lg hover:rounded-xl transition-[background-color]',
    { 'bg-50/50': loading },
    className,
  );

  if (loading && !token) {
    return (
      <button className={cs(classNames, 'token-skeleton')} disabled type="button" {...props}>
        <figure className="bg-black-white m-0 h-5 w-5 shrink-0 overflow-hidden rounded-full">
          <SkeletonWrapper>
            <TokenUnknown className="aspect-square w-full" />
          </SkeletonWrapper>
        </figure>
        <figcaption className="flex flex-col items-start justify-center gap-1">
          <h5 className="text-white-blue text-sm leading-none">
            <SkeletonWrapper>XFIT</SkeletonWrapper>
          </h5>
        </figcaption>
      </button>
    );
  }

  return (
    <button className={classNames} type="button" {...props}>
      <figure className="bg-black-white m-0 h-5 w-5 shrink-0 overflow-hidden rounded-full">
        {token?.logoURI ? (
          <img src={token.logoURI} alt={token.name} />
        ) : (
          <TokenUnknown className="aspect-square w-full" />
        )}
      </figure>
      <figcaption className="flex flex-col items-start justify-center gap-1">
        <h5 className="text-white-blue text-sm leading-none">{token?.symbol}</h5>
      </figcaption>
    </button>
  );
};
