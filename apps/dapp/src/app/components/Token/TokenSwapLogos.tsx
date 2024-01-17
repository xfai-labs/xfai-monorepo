import cs from 'classnames';
import { TokenInfo } from '@uniswap/token-lists';
import { SkeletonWrapper } from '@xfai-labs/ui-components';
import { HTMLProps, FunctionComponent } from 'react';

type TokenSwapLogosProps = {
  tokenIn?: TokenInfo;
  tokenOut?: TokenInfo;
} & HTMLProps<HTMLDivElement>;

export const TokenSwapLogos: FunctionComponent<TokenSwapLogosProps> = ({
  tokenIn,
  tokenOut,
  className,
  ...props
}) => {
  const classNames = cs('flex items-center', className);

  if (!tokenIn || !tokenOut) {
    return (
      <div className={classNames} {...props}>
        <SkeletonWrapper>
          <span className="border-60/50 block h-5 w-5 rounded-full border-2" />
        </SkeletonWrapper>
        <SkeletonWrapper>
          <span className="border-60/50 -ml-2 block h-5 w-5 rounded-full border-2" />
        </SkeletonWrapper>
      </div>
    );
  }

  return (
    <div className={classNames} {...props}>
      <img
        className="border-60/50 block h-5 w-5 rounded-full border-2"
        src={tokenIn.logoURI}
        alt={tokenIn.symbol}
      />
      <img
        className="border-60/50 -ml-2 block h-5 w-5 rounded-full border-2"
        src={tokenOut.logoURI}
        alt={tokenOut.symbol}
      />
    </div>
  );
};
