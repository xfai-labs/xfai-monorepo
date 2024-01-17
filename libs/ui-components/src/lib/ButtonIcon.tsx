import { motion } from 'framer-motion';
import SkeletonWrapper from './SkeletonWrapper';
import cs from 'classnames';
import {
  FC,
  HTMLAttributes,
  HTMLProps,
  forwardRef,
  createElement,
  HTMLAttributeAnchorTarget,
} from 'react';

type Props = {
  skeleton?: boolean;
  size?:
    | 'xx-small'
    | 'x-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'xl'
    | 'xxl'
    | 'header'
    | 'filter'
    | 'form-title';
  color?: string;
  bgColor?: string;
  disabledColor?: string;
  disabledBgColor?: string;
  iconWrapperClassName?: string;
  icon: FC<HTMLAttributes<unknown>>;
  hoverEffect?: 'opacity' | 'scaleUp' | 'scaleDown' | 'rotate';
  square?: boolean;
  noSpace?: boolean;
  type?: 'button' | 'submit' | 'reset';
  NavLink?: any;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  prependChildren?: boolean;
} & Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type'>;

const ButtonIcon = forwardRef<HTMLButtonElement, Props>(
  (
    {
      skeleton = false,
      size = 'medium',
      color = 'text-20 hover:text-10 fill-20 hover:fill-10',
      bgColor = 'bg-60 hover:bg-50',
      disabledColor = 'text-30 fill-30',
      disabledBgColor = 'bg-60',
      iconWrapperClassName,
      icon,
      hoverEffect,
      square = false,
      noSpace = false,
      className,
      disabled,
      type = 'button',
      children,
      NavLink,
      href,
      target,
      prependChildren,
      ...props
    },
    ref,
  ) => {
    const sizeClass = () => {
      switch (size) {
        case 'xx-small':
          return 'p-2 text-xs';
        case 'x-small':
          return 'p-1 text-xs';
        case 'small':
          return 'p-2.5 text-sm';
        case 'large':
          return 'p-2 text-sm';
        case 'xl':
          return 'p-3 text-base';
        case 'xxl':
          return 'p-3 text-base';
        case 'header':
          return 'p-3 text-base';
        case 'filter':
          return 'p-3 text-sm';
        case 'form-title':
          return 'p-1.5 text-xsm';
        default:
          return 'text-sm';
      }
    };

    const sizeIconClass = () => {
      switch (size) {
        case 'xx-small':
          return '[&>svg]:h-2.5';
        case 'x-small':
          return '[&>svg]:h-3.5';
        case 'small':
          return '[&>svg]:h-3.5';
        case 'large':
          return '[&>svg]:h-[1.125rem]';
        case 'xl':
          return '[&>svg]:h-4';
        case 'xxl':
          return '[&>svg]:h-6';
        case 'header':
          return '[&>svg]:h-6';
        case 'filter':
          return '[&>svg]:h-4';
        case 'form-title':
          return '[&>svg]:h-3.5';
        default:
          return '[&>svg]:h-4';
      }
    };

    const hoverEffectClass = () => {
      switch (hoverEffect) {
        case 'opacity':
          return '[&_svg]:hover:opacity-70';
        case 'scaleUp':
          return '[&_svg]:hover:scale-110';
        case 'scaleDown':
          return '[&_svg]:hover:scale-90';
        case 'rotate':
          return '[&_svg]:hover:rotate-[60deg]';
      }
    };

    const classNames = cs(
      'flex items-center justify-center gap-1.5 leading-none outline-none cursor-pointer transition-all duration-100 rounded-lg',
      sizeClass(),
      hoverEffectClass(),
      { '!p-0 lg:!p-0 !bg-transparent': noSpace },
      !disabled ? bgColor : disabledBgColor,
      !disabled ? color : disabledColor,
      { 'pointer-events-none': disabled || skeleton },
      { 'rounded-none': square },
      className,
    );

    const iconWrapperClass = cs(
      // 'transition-[background-color] duration-100',
      sizeIconClass(),
      iconWrapperClassName,
      prependChildren && 'order-last',
    );

    const iconClass = '[transition:transform_.1s_ease-in-out,opacity_.1s_ease-in-out] fill-inherit';

    if (skeleton) {
      return (
        <button className={classNames} disabled type={type} {...props} ref={ref}>
          <SkeletonWrapper>
            <i className={iconWrapperClass}>{createElement(icon, { className: iconClass })}</i>
          </SkeletonWrapper>
          <SkeletonWrapper>Balance 321.256</SkeletonWrapper>
        </button>
      );
    }

    if (NavLink && href) {
      return (
        <NavLink className={classNames} to={href} href={href} target={target}>
          <i className={iconWrapperClass}>{createElement(icon, { className: iconClass })}</i>
          {children}
        </NavLink>
      );
    }

    if (href) {
      return (
        <a className={classNames} href={href} target={target}>
          <i className={iconWrapperClass}>{createElement(icon, { className: iconClass })}</i>
          {children}
        </a>
      );
    }

    return (
      <button className={classNames} disabled={disabled} type={type} {...props} ref={ref}>
        <i className={iconWrapperClass}>{createElement(icon, { className: iconClass })}</i>
        {children}
      </button>
    );
  },
);

const ButtonIconMotion = motion(ButtonIcon);
export default ButtonIconMotion;
