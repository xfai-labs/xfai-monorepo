import Skeleton from 'react-loading-skeleton';
import cs from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

const SkeletonWrapper: FunctionComponent<
  { wrapperClassName?: string } & HTMLProps<HTMLDivElement>
> = ({ children, wrapperClassName, className, ...props }) => {
  const classNames = cs(
    'relative inline-block [&>span:not(.skeleton-children)]:absolute [&>span:not(.skeleton-children)]:inset-0 [&_.react-loading-skeleton]:w-full [&_.react-loading-skeleton]:h-full',
    wrapperClassName,
  );

  return (
    <div className={classNames} {...props}>
      <span className="skeleton-children invisible block opacity-0">{children}</span>
      <Skeleton className={cs('absolute inset-0', className)} />
    </div>
  );
};

export default SkeletonWrapper;
