import cs from 'classnames';
import { FC, HTMLAttributes, forwardRef, createElement } from 'react';

type Props = {
  icon: FC<HTMLAttributes<unknown>>;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
};

const IconRound = forwardRef<HTMLButtonElement, Props>(
  ({ icon, size = 'large', color = 'fill-cyan hover:fill-cyan-dark', className }, ref) => {
    const sizeClass = () => {
      switch (size) {
        case 'small':
          return 'h-3 lg:h-3.5';
        case 'medium':
          return 'h-3 md:h-3.5 lg:h-4';
        default:
          return 'h-3.5 md:h-4';
      }
    };

    const classNames = cs(
      'flex shrink-0 grow-0 rounded-full bg-90 bg-opacity-50 hover:bg-opacity-100 group-hover:bg-opacity-100 transition-[background-color] duration-100 p-0.5',
      color,
      className,
    );

    return (
      <i ref={ref} className={classNames}>
        {createElement(icon, {
          className: cs('fill-inherit transition-[fill] duration-100', sizeClass()),
        })}
      </i>
    );
  },
);

export default IconRound;
