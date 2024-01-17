import cs from 'classnames';
import {
  HTMLAttributeAnchorTarget,
  FC,
  HTMLAttributes,
  HTMLProps,
  forwardRef,
  createElement,
} from 'react';
import SkeletonWrapper from './SkeletonWrapper';

type Props = {
  NavLink?: any;
  href?: string;
  target?: HTMLAttributeAnchorTarget;

  loading?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'manageLiquidity' | 'filter';
  state?: 'normal' | 'warning' | 'error';
  color?: string;
  bgColor?: string;
  disabledColor?: string;
  disabledBgColor?: string;
  warningColor?: string;
  warningBgColor?: string;
  errorColor?: string;
  errorBgColor?: string;
  icon?: FC<HTMLAttributes<unknown>>;
  iconPosition?: 'left' | 'right';
  spaceBetween?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type'>;

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      NavLink = null,
      href = null,
      target = undefined,

      loading = false,
      size = 'medium',
      state = 'normal',
      color = 'text-white hover:text-white fill-white hover:fill-white',
      bgColor = 'bg-magenta hover:bg-magenta-dark',
      disabledColor = 'text-20 fill-20',
      disabledBgColor = 'bg-50',
      warningColor = 'text-white/50 fill-white/50',
      warningBgColor = 'bg-orange-500/[0.15]',
      errorColor = 'text-white/50 fill-white/50',
      errorBgColor = 'bg-red/[0.15]',

      icon,
      iconPosition = 'left',
      spaceBetween,
      className,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const sizeClass = () => {
      switch (size) {
        case 'small':
          return 'text-xs font-medium p-2 gap-1.5 [&_svg]:h-3.5 rounded-lg';
        case 'large':
          return 'text-sm font-medium py-3 px-[1.375rem] lg:px-5 gap-1.5 [&_svg]:h-[1.125rem] lg:[&_svg]:h-4 rounded-lg';
        case 'xl':
          return 'text-base font-medium py-[0.688rem] lg:py-3 px-[1.375rem] lg:px-5 gap-2.5 [&_svg]:h-5 lg:[&_svg]:h-[1.125rem] rounded-lg';
        case 'xxl':
          return 'text-base font-medium py-2.5 md:py-3 lg:py-3 px-4 md:px-6 lg:px-6 gap-3 [&_svg]:h-6 lg:[&_svg]:h-7 rounded-lg';
        case 'manageLiquidity':
          return 'text-base font-medium py-5 2xl:py-6 px-4 gap-2.5 [&_svg]:h-4 rounded-2xl';
        case 'filter':
          return 'text-sm font-normal py-3 px-4 gap-1.5 [&_svg]:h-4 rounded-md';
        default:
          return 'text-sm font-medium py-2.5 px-4 gap-1.5 [&_svg]:h-4 rounded-lg';
      }
    };

    const colorClass = () => {
      if (loading) {
        return disabledColor;
      }

      if (!disabled) {
        return color;
      }

      switch (state) {
        case 'normal':
          return !disabled ? color : disabledColor;
        case 'warning':
          return warningColor;
        case 'error':
          return errorColor;
      }
    };

    const backgroundColorClass = () => {
      if (loading) {
        return disabledBgColor;
      }

      if (!disabled) {
        return bgColor;
      }

      switch (state) {
        case 'normal':
          return !disabled ? bgColor : disabledBgColor;
        case 'warning':
          return warningBgColor;
        case 'error':
          return errorBgColor;
      }
    };

    const iconPositionClass =
      icon && !spaceBetween && (iconPosition === 'left' ? 'pl-2.5' : 'pr-2.5');

    const classNames = cs(
      'inline-flex items-center justify-center leading-none outline-none cursor-pointer transition-colors duration-100',
      sizeClass(),
      iconPositionClass,
      spaceBetween && 'grow justify-between',
      colorClass(),
      backgroundColorClass(),
      { 'pointer-events-none': disabled || loading },
      { 'justify-between': spaceBetween },
      className,
    );

    const iconWrapperClass = iconPosition === 'right' ? 'order-last' : '';

    const iconClass = 'fill-inherit';

    if (loading) {
      return (
        <button className={classNames} disabled type={type} {...props} ref={ref}>
          {icon && (
            <i className={iconWrapperClass}>
              <SkeletonWrapper>{createElement(icon, { className: iconClass })}</SkeletonWrapper>
            </i>
          )}
          <SkeletonWrapper>{children}</SkeletonWrapper>
        </button>
      );
    }

    const buttonContent = () => {
      return (
        <>
          {icon && (
            <i className={iconWrapperClass}>{createElement(icon, { className: iconClass })}</i>
          )}
          {children}
        </>
      );
    };

    if (NavLink && href) {
      return (
        <NavLink className={classNames} to={href} href={href} target={target}>
          {buttonContent()}
        </NavLink>
      );
    }

    if (href) {
      return (
        <a className={classNames} href={href} target={target}>
          {buttonContent()}
        </a>
      );
    }

    return (
      <button className={classNames} disabled={disabled} type={type} {...props} ref={ref}>
        {buttonContent()}
      </button>
    );
  },
);

export default Button;
