import { FunctionComponent, HTMLProps } from 'react';
import cs from 'classnames';

const Column: FunctionComponent<HTMLProps<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cs('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
};

export default Column;
