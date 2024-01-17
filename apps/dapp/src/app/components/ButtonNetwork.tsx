import cs from 'classnames';
import { IconArrowDown, TokenUnknown } from '@xfai-labs/ui-components';
import { HTMLProps, forwardRef } from 'react';
import { ForwardRefComponent } from 'framer-motion';
import useChain from '@dapp/hooks/chain/useChain';

type Props = {
  dropdown?: boolean;
} & Omit<HTMLProps<HTMLButtonElement>, 'type'>;

const ButtonNetwork: ForwardRefComponent<HTMLButtonElement, Props> = forwardRef(
  ({ dropdown, className, ...props }, ref) => {
    const connectedChain = useChain();

    const buttonClasses = cs(
      'group/network-button',
      'relative inline-flex items-center justify-center gap-1.75 lg:gap-2 p-1.75 lg:p-2.5',
      'whitespace-nowrap text-sm leading-none font-medium text-white-blue bg-70 rounded-lg cursor-pointer',
      '[&.dropdown-open]:bg-50',
      'transition-[background-color]',
      className,
    );

    const arrowIconWrapperClasses = cs(
      'relative hidden sm:flex items-center justify-center gap-2 h-full',
      'before:content-[""] before:block before:w-px before:h-4 lg:before:h-5 before:bg-60 before:transition-[background-color]',
      'group-hover/network-button:before:bg-50',
      'group-[.dropdown-open]/network-button:before:bg-30',
    );

    const arrowIconClasses = cs(
      'fill-white-blue h-2.5 transform transition-transform',
      'group-hover/network-button:translate-y-0.5',
      'group-[.dropdown-open]/network-button:-rotate-180 group-[.dropdown-open]/network-button:group-hover/network-button:-translate-y-0.5',
    );
    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {connectedChain?.logoUri ? (
          <img src={connectedChain?.logoUri} alt="icon" className="h-5 w-5 rounded-[4px]" />
        ) : (
          <TokenUnknown className="W-5 h-5 rounded-[4px]" />
        )}
        <span className="hidden !leading-none lg:block">{connectedChain?.label ?? 'Unknown'}</span>
        {dropdown && (
          <i className={arrowIconWrapperClasses}>
            <IconArrowDown className={arrowIconClasses} />
          </i>
        )}
      </button>
    );
  },
);

export default ButtonNetwork;
