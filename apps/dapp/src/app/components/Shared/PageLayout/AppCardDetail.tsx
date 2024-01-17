import { Tooltip, SkeletonWrapper, IconRound, IconRoundInfo } from '@xfai-labs/ui-components';
import { motion } from 'framer-motion';
import cs from 'classnames';
import { HTMLProps, FunctionComponent, createElement, SVGProps } from 'react';

type Props = {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
  value?: string;
  tooltip?: string;
  iconColor?: string;
  loading?: boolean;
} & Omit<
  HTMLProps<HTMLDivElement>,
  'children' | 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
>;

const AppCardDetail: FunctionComponent<Props> = ({
  icon,
  label,
  value,
  tooltip,
  iconColor = 'fill-white-blue',
  loading,
  className,
  ...props
}) => {
  return (
    <motion.div
      key="estimatedApr"
      className={cs('bg-60 flex w-full items-center gap-2.5 rounded-lg px-3 lg:gap-3', className)}
      {...props}
      initial={{
        height: 0,
        opacity: 0,
        overflow: 'hidden',
      }}
      animate={{
        height: 'auto',
        opacity: 1,
        overflow: 'visible',
      }}
      exit={{
        height: 0,
        opacity: 0,
        overflow: 'hidden',
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-10 flex grow items-center justify-between whitespace-nowrap py-1.5 text-sm leading-none lg:py-2">
        <div className="flex grow items-center gap-2.5">
          {createElement(icon, {
            className: cs(iconColor, 'h-6 w-6 lg:h-7 lg:w-7'),
          })}
          <span>{label}</span>
        </div>
        <span className="text-white-blue bg-50 rounded-lg p-1.5 px-2 text-sm leading-none xl:text-base ">
          {value && !loading ? value : <SkeletonWrapper>50.50%</SkeletonWrapper>}
        </span>
      </div>
      <Tooltip text={tooltip}>
        <IconRound size="medium" icon={IconRoundInfo} />
      </Tooltip>
    </motion.div>
  );
};

export default AppCardDetail;
