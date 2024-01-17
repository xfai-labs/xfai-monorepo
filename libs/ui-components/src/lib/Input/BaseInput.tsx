import Tooltip from '../Tooltip';
import { IconRoundError } from '../assets/icons';
import SkeletonWrapper from '../SkeletonWrapper';
import SkeletonCover from '../SkeletonCover';
import { motion, AnimatePresence } from 'framer-motion';
import cs from 'classnames';
import {
  HTMLProps,
  forwardRef,
  useRef,
  useImperativeHandle,
  HTMLAttributes,
  FC,
  createElement,
} from 'react';

export type BaseInputProps = {
  // Label Below Input Field (e.g. "~$10,000")
  bottomLabel?: string;

  // Determines the color of the validation message and icon (e.g. "error" or "warning")
  validationType?: 'error' | 'warning';

  // Validation message (e.g. "Insufficient balance") that besides the bottom label
  validationMessage?: string;

  // Longer description of the validation message that appears on hover
  validationTooltip?: string;

  // Input alignment (e.g. "left" or "right")
  alignment?: 'left' | 'right';

  // Add an icon next to the input validation
  inputTooltipIcon?: FC<HTMLAttributes<unknown>>;

  // Add a tooltip message for the inputTooltipIcon
  inputTooltipMessage?: string;

  // Larger input without border and padding
  largeInput?: boolean;

  // Custom className for the wrapper div
  wrapperClassName?: string;

  // Loading state for both the input and the bottom label
  loading?: boolean;

  // Loading state for only the input (ex. while calculating swap amount)
  inputLoading?: boolean;

  // Loading state for only the bottom label (ex. while calculating the fiat value)
  bottomLabelLoading?: boolean;
} & HTMLProps<HTMLInputElement>;

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      bottomLabel,
      validationType,
      validationMessage,
      validationTooltip,
      alignment = 'left',
      inputTooltipIcon,
      inputTooltipMessage,
      largeInput,
      wrapperClassName,
      loading,
      inputLoading,
      bottomLabelLoading,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => internalRef.current,
    );

    const validationColor = (): string => {
      switch (validationType) {
        case 'error':
          return 'text-red fill-red';
        case 'warning':
          return 'text-orange-500 fill-orange-500';
        default:
          return 'text-10 fill-20';
      }
    };

    const validationBorderColor = (): string => {
      switch (validationType) {
        case 'error':
          return '!border-red !border-opacity-10';
        case 'warning':
          return '!border-orange-500 !border-opacity-10';
        default:
          return '';
      }
    };

    return (
      <div
        className={cs(
          'input-wrapper flex min-w-0 flex-col justify-center',
          wrapperClassName,
          largeInput ? 'gap-0' : 'gap-3',
          alignment === 'right' ? 'items-end text-right' : 'items-start text-left',
        )}
      >
        <div className="relative w-full">
          <input
            className={cs(className, validationBorderColor(), {
              '!rounded-none !border-none !bg-transparent !p-0 !text-lg !font-medium !leading-none md:!text-xl lg:!text-2xl':
                largeInput,
              'opacity-0': loading || inputLoading,
            })}
            disabled={loading || inputLoading || disabled}
            {...props}
            ref={internalRef}
          />
          {(loading || inputLoading) && (
            <SkeletonCover
              className={cs('w-full max-w-[50%]', { 'left-auto right-0': alignment === 'right' })}
            />
          )}
        </div>
        <AnimatePresence mode="wait">
          {(bottomLabel || validationMessage || inputTooltipIcon) && (
            <motion.div
              className={cs(
                'flex w-full items-center gap-1.5 overflow-hidden text-xs !leading-none md:text-sm',
                alignment === 'right' && 'justify-end',
              )}
              key="bottomWrapper"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `auto`, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {loading || bottomLabelLoading ? (
                  <SkeletonWrapper>~$00000000</SkeletonWrapper>
                ) : (
                  <>
                    {bottomLabel && (
                      <motion.span
                        className={cs('text-10 shrink overflow-hidden text-ellipsis')}
                        key="bottomLabel"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {bottomLabel}
                      </motion.span>
                    )}
                    {validationMessage && (
                      <motion.span
                        className={cs(validationColor(), 'shrink-0 whitespace-nowrap')}
                        key="validationMessage"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {validationMessage}
                      </motion.span>
                    )}
                    {validationMessage && validationType && !validationTooltip && (
                      <motion.span
                        className="h-3 w-3 shrink-0"
                        key="validationIcon"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <IconRoundError className={cs('h-full w-full', validationColor())} />
                      </motion.span>
                    )}
                    {validationMessage && validationType && validationTooltip && (
                      <Tooltip text={validationTooltip} placement={'top'} offset={[0, -6]}>
                        <motion.span
                          className="h-3 w-3 shrink-0"
                          key="validationIcon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <IconRoundError className={cs('h-full w-full', validationColor())} />
                        </motion.span>
                      </Tooltip>
                    )}
                    {inputTooltipIcon && (
                      <Tooltip
                        text={(bottomLabel || validationMessage) && inputTooltipMessage}
                        placement={'top'}
                        offset={[0, -6]}
                      >
                        <div className="flex items-center gap-1.5 text-xs">
                          {!(bottomLabel || validationMessage) && inputTooltipMessage}
                          <motion.span
                            className="h-3 w-3 shrink-0"
                            key="inputTooltipIcon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                          >
                            {createElement(inputTooltipIcon, { className: 'h-full w-full' })}
                          </motion.span>
                        </div>
                      </Tooltip>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

export default BaseInput;
