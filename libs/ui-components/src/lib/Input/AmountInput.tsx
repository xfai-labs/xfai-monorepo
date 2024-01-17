import { FunctionComponent, ClipboardEvent, KeyboardEvent, useEffect, useRef } from 'react';
import BaseInput, { BaseInputProps } from './BaseInput';

export type NumberInputProps = {
  value: string | undefined;
  maxDecimals?: number;
  setValue: (value: undefined | string) => void;
} & Omit<BaseInputProps, 'ref'>;

const AmountInput: FunctionComponent<NumberInputProps> = ({
  value,
  setValue,
  loading,
  onChange,
  onPaste,
  onKeyDown,
  type = 'text',
  alignment = 'right',
  maxDecimals,
  placeholder = '0.0',
  inputMode = 'decimal',
  autoComplete = 'off',
  autoCorrect = 'off',
  ...props
}) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.value = formatCurrency(value, loading);
    }
  }, [value, input, loading]);

  return (
    <BaseInput
      ref={input}
      largeInput
      alignment={alignment}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      type={type}
      inputMode={inputMode}
      loading={loading}
      onChange={(event) => {
        if (!input.current) return;
        let newValue = removeNumberFormat(event.currentTarget.value);
        if (maxDecimals) newValue = limitDecimals(newValue, maxDecimals);
        setValue(newValue === '' ? undefined : newValue);
        input.current.value = formatCurrency(newValue, loading);
        onChange && onChange(event);
      }}
      onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
        onPaste && onPaste(event);
        const clipboardText = event.clipboardData.getData('text')?.trim();

        if (!/^([0-9]+.)+$/.test(clipboardText)) {
          event.preventDefault();
          return;
        }
      }}
      onKeyDown={function (event: KeyboardEvent<HTMLInputElement>) {
        onKeyDown && onKeyDown(event);

        if (event.key.length > 1 || event.altKey || event.ctrlKey || event.metaKey) {
          // Allow: backspace, delete, tab, escape, enter, control chars
          return;
        }

        const currentValue = event.currentTarget.value;
        const hasDecimal = /[.,]/g.test(currentValue);

        if (['.', ','].includes(event.key)) {
          if (currentValue.length === 0) {
            event.currentTarget.value += '0.';
            event.preventDefault();
          } else if (hasDecimal) {
            // Prevent multiple decimals
            event.preventDefault();
          }
          return;
        }

        if (!/[0-9]/.test(event.key)) {
          // Prevent non-numeric characters
          event.preventDefault();
          return;
        }

        if (currentValue.length === 0 && event.key === '0') {
          event.currentTarget.value += '0.';
          event.preventDefault();
          return;
        }
      }}
      {...props}
    />
  );
};

const removeNumberFormat = (number: string) => {
  // Replace commas with dots
  let unformattedNumber = number.replace(',', '.');

  // Remove leading zeros
  unformattedNumber = unformattedNumber.replace(/^0+([1-9]+.*)/, '$1');

  // Remove extra decimals
  unformattedNumber = removeExtraDecimals(unformattedNumber);

  // Remove leading zeros
  unformattedNumber = unformattedNumber.replace(/^0+([1-9]+.*)/, '$1');

  // Remove all non-numeric characters and return
  return unformattedNumber.replace(/[^0-9.]/g, '').trim();
};

const removeExtraDecimals = (number: string) => {
  // Remove extra decimals
  return number.replace(/,/g, '.').replace(/[.](?!\d*$)/g, '');
};

const formatNumber = (number: string) => {
  // Format number 1000000 to 1 234 567
  return number.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatCurrency = (newValue: undefined | string, isLoading?: boolean) => {
  if (!newValue || newValue === '' || isLoading) {
    return '';
  }

  let prefix = '';
  if (newValue.includes('<')) {
    prefix = '<';
  }

  const [whole, decimal] = newValue.split('.');

  if (!decimal) {
    return `${prefix}${formatNumber(whole)}${newValue.includes('.') ? '.' : ''}`;
  }

  return `${prefix}${formatNumber(whole)}.${decimal}`;
};
const limitDecimals = (value: string, maxDecimals: number) => {
  const [whole, decimal] = value.split('.');
  if (!decimal || decimal.length <= maxDecimals) {
    return value;
  }
  return `${whole}.${decimal.substring(0, maxDecimals)}`;
};

export default AmountInput;
