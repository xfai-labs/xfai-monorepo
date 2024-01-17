import { motion } from 'framer-motion';
import IconRound from './IconRound';
import SkeletonWrapper from './SkeletonWrapper';
import cs from 'classnames';
import { FC, HTMLAttributes, HTMLProps, forwardRef } from 'react';

type Props = {
  skeleton?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabledColor?: string;
  icon: FC<HTMLAttributes<unknown>>;
  type?: 'button' | 'submit' | 'reset';
} & Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type'>;

const ButtonRound = forwardRef<HTMLButtonElement, Props>(
  (
    {
      skeleton = false,
      size = 'large',
      color = 'text-cyan hover:text-cyan-dark fill-cyan hover:fill-cyan-dark',
      disabledColor = 'text-30 fill-30',
      icon,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const sizeClass = () => {
      switch (size) {
        case 'small':
          return 'text-xs md:text-xsm';
        default:
          return 'text-xs md:text-sm';
      }
    };

    const classNames = cs(
      'flex items-center justify-center gap-1 md:gap-1 !leading-none bg-transparent outline-none rounded cursor-pointer group transition-[color] duration-100',
      sizeClass(),
      !disabled ? color : disabledColor,
      { 'pointer-events-none': disabled || skeleton },
      className,
    );

    if (skeleton) {
      return (
        <button className={classNames} disabled type={type} {...props} ref={ref}>
          <SkeletonWrapper>
            <IconRound size={size} icon={icon} />
          </SkeletonWrapper>
          <SkeletonWrapper>{props.children}</SkeletonWrapper>
        </button>
      );
    }

    return (
      <button className={classNames} disabled={disabled} type={type} {...props} ref={ref}>
        <IconRound size={size} color="fill-inherit" icon={icon} />
        {props.children}
      </button>
    );
  },
);

const ButtonRoundMotion = motion(ButtonRound);
export default ButtonRoundMotion;
