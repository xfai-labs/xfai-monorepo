import IconRound from './IconRound';
import ButtonIcon from './ButtonIcon';
import Tooltip from './Tooltip';
import SkeletonWrapper from './SkeletonWrapper';
import Spinner from './Spinner';
import cs from 'classnames';
import { IconRoundInfo } from './assets/icons';
import { FC, HTMLAttributes, FunctionComponent } from 'react';

type Props = {
  skeleton?: boolean;
  title: string;
  lightTitle?: boolean;
  size?: 'large' | 'medium' | 'small';
  titleColor?: string;
  titleTooltip?: string;
  value?: string;
  valueTooltip?: string;
  valueIsLoading?: boolean;
  valueIsRefreshing?: boolean;
  buttonIcon?: FC<HTMLAttributes<unknown>>;
  buttonText?: string;
  buttonOnClick?: () => void;
} & HTMLAttributes<HTMLDivElement>;

const FormTitle: FunctionComponent<Props> = ({
  skeleton,
  title,
  lightTitle,
  size,
  titleColor,
  titleTooltip,
  value,
  valueTooltip,
  valueIsLoading,
  valueIsRefreshing,
  buttonIcon,
  buttonText,
  buttonOnClick,
  className,
}) => {
  const titleWeightClass = cs(lightTitle ? 'font-normal' : 'font-medium');
  const titleColorClass = cs(titleColor ? titleColor : lightTitle ? 'text-10' : 'text-white-blue');
  const titleClassName = cs(titleWeightClass, titleColorClass, '!loading-none ');

  const titleElement = () => {
    switch (size) {
      case 'large':
        return <h5 className={cs('text-sm md:text-base', titleClassName)}>{title}</h5>;
      case 'small':
        return <span className={cs('text-xsm', titleClassName)}>{title}</span>;
      default:
        return <h6 className={cs('text-xsm md:text-sm', titleClassName)}>{title}</h6>;
    }
  };

  const getTooltipSize = () => {
    switch (size) {
      case 'large':
        return 'large';
      case 'medium':
        return 'medium';
      default:
        return 'small';
    }
  };

  const tooltipElement = (toolTipText: string | undefined) => {
    if (toolTipText) {
      return (
        <Tooltip text={toolTipText}>
          <IconRound size={getTooltipSize()} icon={IconRoundInfo} />
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  const getValueClass = () => {
    switch (size) {
      case 'large':
        return 'text-sm md:text-base';
      case 'small':
        return 'text-xs';
      default:
        return 'text-xsm md:text-sm';
    }
  };

  const valueElement = () => {
    if (value) {
      return <span className={cs('text-cyan', getValueClass())}>{value}</span>;
    } else {
      return null;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'large':
        return 'xl';
      case 'small':
        return 'medium';
      default:
        return 'large';
    }
  };

  const rightButtonElement = () => {
    if (buttonIcon && buttonOnClick) {
      return (
        <ButtonIcon
          size={!buttonText ? getButtonSize() : 'form-title'}
          color="fill-5 hover:fill-white-blue text-10 hover:text-white-blue"
          square={!buttonText && true}
          noSpace={!buttonText && true}
          icon={buttonIcon}
          onClick={buttonOnClick}
          prependChildren
        >
          {buttonText}
        </ButtonIcon>
      );
    } else {
      return null;
    }
  };

  const classNames = cs('flex justify-between items-center gap-1', className);

  const titleElements = () => (
    <div className="flex items-center justify-start gap-1">
      {titleElement()}
      {tooltipElement(titleTooltip)}
    </div>
  );

  const valueElements = () => (
    <div className="flex items-center justify-end gap-1.5">
      {valueIsRefreshing && (
        <Spinner round className="!h-3 !w-3" spinnerRoundChildClassName="!border-2" />
      )}
      {valueElement()}
      {tooltipElement(valueTooltip)}
      {rightButtonElement()}
    </div>
  );

  const titleSkeleton = () => {
    return <SkeletonWrapper>{titleElements()}</SkeletonWrapper>;
  };

  const valueSkeleton = () => {
    return <SkeletonWrapper>{valueElements()}</SkeletonWrapper>;
  };

  return (
    <div className={classNames}>
      {skeleton ? titleSkeleton() : titleElements()}
      {skeleton || valueIsLoading ? valueSkeleton() : valueElements()}
    </div>
  );
};

export default FormTitle;
