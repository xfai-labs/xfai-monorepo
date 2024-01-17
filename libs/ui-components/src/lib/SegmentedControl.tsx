import {
  HTMLAttributes,
  useEffect,
  useState,
  useRef,
  useMemo,
  HTMLProps,
  ReactElement,
} from 'react';
import { useElementSize } from 'usehooks-ts';
import cs from 'classnames';

export type PresetItem<V extends string, L extends string | number = string> = {
  label: L;
  value: V;
};

export type SegmentedControlProps<V extends string, L extends string = string> = {
  presets: PresetItem<V, L>[];
  initialValue: V;
  onValue: (value: V) => void;
  customInput?: Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'onFocus' | 'type'> & {
    unit?: string;
  };
  size?: 'small' | 'medium' | 'large';
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>;

export function SegmentedControl<V extends string, L extends string = string>({
  presets,
  initialValue,
  onValue,
  customInput,
  size = 'large',
  className,
  ...otherProps
}: SegmentedControlProps<V, L>): ReactElement {
  const customInputWrapperRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [innerWrapperRef, { width: wrapperWidth }] = useElementSize();
  const indicatorRef = useRef<HTMLElement>(null);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [usingCustomInput, setUsingCustomInput] = useState<boolean>(false);
  const [value, setValue] = useState<V>(initialValue);

  const activeItemIndex = useMemo(() => {
    if (usingCustomInput) return presets.length;

    const index = presets.findIndex((item) => item.value === value);
    if (index === -1) return presets.length;

    return index;
  }, [presets, value, usingCustomInput]);

  const itemCount = presets.length + Number(!!customInput);

  useEffect(() => {
    if (!indicatorRef.current) return;
    const indicatorWidth = wrapperWidth / itemCount;
    const { style } = indicatorRef.current;
    style.setProperty('width', `${indicatorWidth}px`);
    style.setProperty('left', `${indicatorWidth * activeItemIndex}px`);
    setLoaded(true);
  }, [activeItemIndex, wrapperWidth, itemCount]);

  useEffect(() => onValue(value), [value, onValue]);

  const sizeClass = () => {
    switch (size) {
      case 'small':
        return 'py-0.75 px-1.5';
      case 'medium':
        return 'py-1 px-2';
      default:
        return 'py-1.5 2xl:py-2 px-2.5 2xl:px-3';
    }
  };

  return (
    <div
      className={cs('bg-60 border-50 grow overflow-hidden rounded-lg border p-1', className)}
      {...otherProps}
    >
      <div ref={innerWrapperRef} className="relative flex grow flex-nowrap text-center text-sm">
        <span
          className={cs('bg-magenta absolute inset-y-0 left-0 z-0 rounded', {
            'transition-all duration-300': indicatorRef.current && loaded,
          })}
          ref={indicatorRef}
        />
        {presets?.map((item, index) => (
          <div
            key={index}
            tabIndex={index}
            className={cs(
              'transition-color relative z-10 w-0 flex-1 cursor-pointer p-px',
              { 'text-white before:!opacity-0': activeItemIndex === index },
              'before:bg-10 before:-z-1 before:absolute before:inset-y-1 before:left-0 before:block before:w-px before:opacity-20 before:content-[""]',
              '[&:first-of-type:before]:!opacity-0',
            )}
            onClick={() => setValue(item.value)}
          >
            <span className={cs('block', sizeClass())}>{item.label}</span>
          </div>
        ))}

        {customInput && (
          <div className={cs('relative z-10 w-0 flex-1 p-px')} ref={customInputWrapperRef}>
            <div className="bg-70 item-center flex h-full w-full gap-1 rounded px-2">
              <input
                {...customInput}
                type="text"
                tabIndex={presets?.length + 1}
                autoFocus={false}
                onFocus={() => {
                  if (customInputRef.current?.value === '') {
                    setValue('' as V);
                  }
                  setUsingCustomInput(true);
                }}
                onBlur={() => setUsingCustomInput(false)}
                value={
                  usingCustomInput || activeItemIndex === presets.length ? (value as string) : ''
                }
                placeholder={customInput.placeholder ?? 'Other'}
                onChange={(e) => {
                  setValue(e.currentTarget.value as V);
                }}
                ref={customInputRef}
                className="placeholder:!text-10 !relative !m-0 !h-auto !rounded-none !border-none !bg-transparent !p-0 !text-right !text-sm !outline-none"
              />
              {customInput.unit && (
                <span className="text-white-black inline-flex items-center font-medium leading-none">
                  {customInput.unit}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
