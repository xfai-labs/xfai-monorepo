import { FunctionComponent, HTMLProps, SVGProps, createElement } from 'react';
import {
  IconArrowStemThickDown,
  IconArrowStemThickUp,
  IconMinusThick,
} from '@xfai-labs/ui-components';
import cs from 'classnames';

type ChangeProps = {
  change: 'neutral' | 'positive' | 'negative';
  sizeClass?: string;
} & HTMLProps<HTMLSpanElement>;

const Change: FunctionComponent<ChangeProps> = ({
  change,
  className,
  children,
  sizeClass,
  ...props
}) => {
  const getColorClass = (): string => {
    switch (change) {
      case 'positive':
        return 'text-cyan fill-cyan';
      case 'negative':
        return 'text-red fill-red';
      default:
        return 'text-white-blue fill-10';
    }
  };

  const getIcon = (): FunctionComponent<SVGProps<SVGSVGElement>> => {
    switch (change) {
      case 'positive':
        return IconArrowStemThickUp;
      case 'negative':
        return IconArrowStemThickDown;
      default:
        return IconMinusThick;
    }
  };

  return (
    <span
      className={cs(className, 'flex items-center gap-1.5 leading-none', getColorClass())}
      {...props}
    >
      {createElement(getIcon(), { className: cs('h-3 w-3', sizeClass) })}
      {children}
    </span>
  );
};

export default Change;
