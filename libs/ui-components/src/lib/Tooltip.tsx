import RcTooltip from 'rc-tooltip';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';
import { ReactElement, forwardRef } from 'react';
import cs from 'classnames';

type Props = {
  text?: string;
  name?: string;
  children: ReactElement;
  className?: string;
  tooltipClassName?: string;
  triggerClassName?: string;
  offset?: number[];
} & Pick<TooltipProps, 'trigger' | 'visible' | 'placement' | 'motion' | 'getTooltipContainer'>;

const Tooltip = forwardRef<HTMLSpanElement, Props>(
  (
    {
      text,
      name,
      children,
      className,
      tooltipClassName,
      triggerClassName,
      visible,
      offset = [0, 5],
      trigger = ['hover'],
      placement = 'bottom',
      motion = { motionName: 'tooltip-slide' },
      ...props
    },
    ref,
  ) => {
    if (!text || text === '') {
      return children;
    }

    return (
      <RcTooltip
        id={name}
        {...(visible !== undefined ? { visible } : {})}
        trigger={trigger}
        overlay={<span className={tooltipClassName}>{text}</span>}
        align={{
          offset: offset,
        }}
        placement={placement}
        destroyTooltipOnHide={true}
        motion={motion}
        showArrow={true}
        overlayClassName={cs('tooltip-overlay', className)}
        prefixCls="tooltip"
        {...props}
      >
        <span className={cs('tooltip-trigger', triggerClassName)} aria-describedby={name} ref={ref}>
          {children}
        </span>
      </RcTooltip>
    );
  },
);

export default Tooltip;
