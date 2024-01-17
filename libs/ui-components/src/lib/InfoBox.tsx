import cs from 'classnames';
import { FC, HTMLAttributes, FunctionComponent, createElement } from 'react';
import { IconRoundInfo } from './assets/icons';
import SkeletonWrapper from './SkeletonWrapper';

type Props = {
  icon?: FC<HTMLAttributes<unknown>>;
  iconColor?: string;
  bgColor?: string;
  loading?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const InfoBox: FunctionComponent<Props> = ({
  icon = IconRoundInfo,
  iconColor = 'fill-cyan',
  bgColor = 'bg-60',
  loading,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cs(
        'flex items-center gap-3 rounded-lg p-3 text-start lg:gap-4 lg:p-4',
        bgColor,
        className,
      )}
      {...props}
    >
      <i className={iconColor}>{icon && createElement(icon, { className: 'h-4' })}</i>
      <div className="text-xsm flex w-0 grow flex-col gap-1 md:text-sm">
        {!loading ? children : <SkeletonWrapper>Loading Content</SkeletonWrapper>}
      </div>
    </div>
  );
};

export default InfoBox;
