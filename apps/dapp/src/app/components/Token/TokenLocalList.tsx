import { TokenInfo } from '@uniswap/token-lists';
import { TokenView } from './TokenView';

import cs from 'classnames';
import {
  Spinner,
  ButtonIcon,
  IconTrash,
  IconRound,
  IconRoundInfo,
  Tooltip,
} from '@xfai-labs/ui-components';
import { HTMLProps, FunctionComponent } from 'react';

export type TokenLocalListProps = {
  tokens: TokenInfo[];
  onTokenRemove?: (token: TokenInfo) => void;
  loading?: boolean;
} & HTMLProps<HTMLDivElement>;

export const TokenLocalList: FunctionComponent<TokenLocalListProps> = ({
  tokens,
  onTokenRemove,
  loading,
  className,
  ...props
}) => {
  const classNames = cs('flex flex-col', className);

  if (loading) {
    return (
      <div className={cs(classNames, 'h-full w-full items-center justify-center')} {...props}>
        <Spinner />
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div
        className={cs(classNames, 'flex h-full  w-full items-center justify-center pt-20')}
        {...props}
      >
        No imported tokens
      </div>
    );
  }

  return (
    <div className={classNames} {...props}>
      {tokens.map((token) => (
        <div
          key={token.address}
          className="border-60 hover:bg-60 flex items-center justify-between border-b bg-transparent px-5 py-2.5 transition-colors"
        >
          <TokenView token={token} name />
          <div className="flex items-center justify-end gap-1.5">
            <ButtonIcon
              size="large"
              color="fill-red"
              bgColor="bg-transparent hover:bg-50"
              className="[&>i]:!p-1"
              icon={IconTrash}
              onClick={() => {
                if (!onTokenRemove) return;
                onTokenRemove(token);
              }}
            />
            <Tooltip text={`Token Address: ${token.address}`} className="break-all text-left">
              <IconRound icon={IconRoundInfo} />
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};
