import { FunctionComponent, useState } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { useElementSize } from 'usehooks-ts';
import { Tooltip } from '@xfai-labs/ui-components';
import cs from 'classnames';

type Props = {
  limit?: number;
  limitMarkerText?: string;
  limitMarkerTooltip?: string;
  limitColor?: string;
} & RadixSlider.SliderProps;

const Slider: FunctionComponent<Props> = ({
  className,
  disabled,
  onValueChange,
  limit = 100,
  limitMarkerText,
  limitMarkerTooltip,
  limitColor = 'bg-red',
  ...props
}) => {
  const [value, setValue] = useState(0);
  const [trackRef, { width: trackWidth }] = useElementSize();

  return (
    <RadixSlider.Root
      className={cs(
        'relative flex h-9 w-full touch-none select-none items-center',
        limit > 0 && limit < 100 && limitMarkerText && 'mb-6',
        disabled && 'pointer-events-none',
        className,
      )}
      onValueChange={(currentValue) => {
        setValue(currentValue[0]);
        onValueChange && onValueChange(currentValue);
      }}
      disabled={disabled}
      {...props}
    >
      {limit > 0 && limit < 100 && limitMarkerText && (
        <div
          className="absolute top-1/2 h-full w-px -translate-x-full"
          style={{ left: `${limit}%` }}
        >
          <span className="bg-20 block h-1/3 w-px rounded-full"></span>
          <span
            className={cs(
              'text-10 absolute mt-0.5 block text-[0.655rem]',
              limit < 10 && '-left-3 text-left',
              limit > 90 && '-right-3 text-right',
              limit >= 10 && limit <= 90 && 'left-1/2 -translate-x-1/2 text-center',
            )}
          >
            <Tooltip text={limitMarkerTooltip} placement="top" offset={[0, -30]}>
              <span>{limitMarkerText}</span>
            </Tooltip>
          </span>
        </div>
      )}

      <RadixSlider.Track
        className={cs(
          'relative h-1 grow overflow-hidden rounded-full',
          !disabled ? 'bg-30' : 'bg-50',
        )}
        ref={trackRef}
      >
        <RadixSlider.Range
          className={cs('absolute h-full rounded-full', !disabled ? 'bg-cyan' : 'bg-20')}
        />
        {limit > 0 && limit < 100 && (
          // Cannot control RadixSlider.Range `style` attribute, so we have to use a nested spans
          <span className="absolute right-0 h-full overflow-hidden" style={{ left: `${limit}%` }}>
            <span className="absolute right-0 h-full" style={{ width: trackWidth }}>
              <RadixSlider.Range
                className={cs('absolute h-full rounded-e-full', !disabled ? limitColor : 'bg-20')}
              />
            </span>
          </span>
        )}
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className={cs(
          'block h-5 w-5 cursor-pointer rounded-full transition-transform duration-100 hover:scale-110',
          !disabled ? (value <= limit ? 'bg-cyan hover:bg-cyan-dark' : limitColor) : 'bg-20',
        )}
      />
    </RadixSlider.Root>
  );
};

export default Slider;
