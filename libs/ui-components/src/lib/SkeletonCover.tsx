import Skeleton from 'react-loading-skeleton';
import cs from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

const SkeletonCover: FunctionComponent<HTMLProps<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cs('radius-none absolute inset-0', className)} {...props}>
      <Skeleton className="radius-none absolute inset-0" />
    </div>
  );
};

export default SkeletonCover;
