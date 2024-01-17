import { TokenView } from './TokenView';
import cs from 'classnames';
import { SkeletonWrapper } from '@xfai-labs/ui-components';
import { ComponentProps, HTMLProps, FunctionComponent } from 'react';

type Props = Pick<ComponentProps<typeof TokenView>, 'token' | 'loading'> &
  HTMLProps<HTMLDivElement>;

export const TokenAddressBox: FunctionComponent<Props> = ({
  token,
  loading,
  className,
  ...props
}) => {
  const classNames = cs(
    'flex flex-col items-center gap-4 py-2.5 px-3.5 bg-60 rounded-lg',
    className,
  );
  return (
    <div className={classNames} {...props}>
      <TokenView token={token} loading={loading} name />
      <hr className="m-0 self-center" />
      <span className="text-cyn break-all text-left text-xs">
        {loading || !token ? (
          <SkeletonWrapper>0x4aa41bC1649C9C3177eD16CaaA11482295fC7441</SkeletonWrapper>
        ) : (
          token.address
        )}
      </span>
    </div>
  );
};
