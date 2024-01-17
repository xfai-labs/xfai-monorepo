import { FunctionComponent, HTMLProps } from 'react';
import cs from 'classnames';

export const TableWrapper: FunctionComponent<HTMLProps<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cs(
        className,
        'bg-60/50 border-60/20 dark:border-60 text-white-blue grid overflow-hidden rounded-lg border text-sm font-normal leading-none',
      )}
      {...props}
    >
      {children}
    </div>
  );
};
