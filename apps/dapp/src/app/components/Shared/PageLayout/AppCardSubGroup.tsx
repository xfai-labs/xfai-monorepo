import { FunctionComponent, HTMLAttributes } from 'react';
import cs from 'classnames';

const AppCardSubGroup: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return <div className={cs('flex w-full flex-col gap-0.5', className)}>{children}</div>;
};

export default AppCardSubGroup;
