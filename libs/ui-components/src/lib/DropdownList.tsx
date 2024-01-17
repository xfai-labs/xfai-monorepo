import cs from 'classnames';
import {
  HTMLProps,
  FunctionComponent,
  createElement,
  HTMLAttributes,
  HTMLAttributeAnchorTarget,
} from 'react';
import { IconCheckMark } from './assets/icons';

type ListProps = {
  arrow?: boolean;
  position?: 'top' | 'bottom';
  checkMark?: boolean;
} & HTMLProps<HTMLDivElement>;

export const DropdownList: FunctionComponent<ListProps> = ({
  arrow = true,
  checkMark = false,
  children,
  className,
  ...props
}) => {
  const dropdownClasses = cs(
    'group/list-dropdown',
    'relative flex flex-col items-center font-sans text-sm min-w-[10rem]',
    !checkMark && 'no-checkmark',
    className,
  );

  return (
    <div className={dropdownClasses} {...props}>
      {arrow && (
        <i
          className={cs(
            'z-[400] flex h-0 w-full justify-center',
            'after:h-0 after:w-0 after:border-8 after:border-transparent',
            'after:border-b-70 mt-2.5 after:-translate-y-full',
          )}
        />
      )}
      <ul className="bg-70 flex w-full flex-col overflow-hidden rounded-lg">{children}</ul>
    </div>
  );
};

type ItemProps = {
  iconURL?: string;
  icon?: FunctionComponent<HTMLAttributes<unknown>>;
  iconPlacement?: 'left' | 'right';
  iconClassName?: string;
  selected?: boolean;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
} & Omit<HTMLProps<HTMLButtonElement>, 'type'>;

export const DropdownItem: FunctionComponent<ItemProps> = ({
  iconURL,
  icon,
  iconClassName = 'fill-10',
  iconPlacement = 'left',
  selected = false,
  children,
  className,
  disabled,
  onClick,
  href,
  target,
  ...props
}) => {
  const dropdownItemClasses = cs(
    'group/list-dropdown-item',
    'flex items-center text-left gap-2.5 p-3 font-normal',
    'outline-none transition-colors cursor-pointer',
    'border-b border-60 last-of-type:border-b-0  ',
    !selected
      ? 'text-10 bg-transparent hover:text-white-blue hover:bg-60'
      : 'text-white-blue bg-60 pointer-events-none',
    className,
    disabled && 'opacity-50 pointer-events-none',
  );

  const dropdownContent = (
    <>
      {iconURL && !icon && (
        <img
          src={iconURL}
          className={cs(
            'h-5 w-5 rounded-[4px] transition-transform group-hover/list-dropdown-item:scale-90',
            iconPlacement === 'right' && 'order-last',
          )}
          alt="icon"
        />
      )}
      {icon &&
        !iconURL &&
        createElement(icon, {
          className: cs('h-4 w-4', iconPlacement === 'right' && 'order-last', iconClassName),
        })}
      <span className="grow">{children}</span>
      <IconCheckMark
        className={cs(
          'h-3.5 fill-white transition-opacity duration-75 group-[.no-checkmark]/list-dropdown:hidden',
          !selected ? 'opacity-0' : 'opacity-100',
        )}
      />
    </>
  );
  if (href) {
    return (
      <a className={dropdownItemClasses} href={href} target={target}>
        {dropdownContent}
      </a>
    );
  }
  if (onClick) {
    return (
      <button className={dropdownItemClasses} onClick={!selected ? onClick : undefined} {...props}>
        {dropdownContent}
      </button>
    );
  }
  return <div className={dropdownItemClasses}>{dropdownContent}</div>;
};
