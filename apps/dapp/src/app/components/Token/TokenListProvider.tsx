import { TokenList } from '@uniswap/token-lists';
import cs from 'classnames';
import { Switch } from '@headlessui/react';
import { HTMLProps, FunctionComponent } from 'react';

export type TokenListProviderProps = {
  provider: TokenList & { enabled: boolean };
  toggle: undefined | (() => void);
} & Omit<HTMLProps<HTMLDivElement>, 'name'>;

export const TokenListProvider: FunctionComponent<TokenListProviderProps> = ({
  provider,
  className,
  toggle,
  ...props
}) => {
  const classNames = cs(
    'border-60 flex items-center justify-between border-b bg-transparent py-2.5 px-5 transition-colors',
    className,
  );

  return (
    <div className={classNames} {...props}>
      <div className="'group/provider flex items-center justify-start gap-2.5 py-[0.313rem]">
        <figure className="bg-30 m-0 h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img src={provider.logoURI} alt={provider.name} className="aspect-square w-full" />
        </figure>
        <figcaption className="flex flex-col items-start justify-center gap-1">
          <h5 className={`text-white-blue leading-none`}>{provider.name}</h5>
          <span className="text-10 whitespace-nowrap text-xs leading-none">
            {provider.tokens.length} Tokens
          </span>
        </figcaption>
      </div>
      {toggle && (
        <Switch
          checked={provider.enabled}
          onChange={toggle}
          className={cs(
            provider.enabled ? 'bg-cyan border-cyan-dark' : 'bg-70 border-50',
            'transition-color relative inline-flex	h-7 w-12 items-center rounded-lg border-2',
          )}
        >
          <span className="sr-only">Enable {provider.name} List</span>
          <span
            className={cs(
              provider.enabled ? 'translate-x-6 bg-white' : 'bg-10 translate-x-1',
              'inline-block h-4 w-4 transform rounded-[3px] transition-all',
            )}
          />
        </Switch>
      )}
    </div>
  );
};
