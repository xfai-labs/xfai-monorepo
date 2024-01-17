import cs from 'classnames';
import { Switch as HeadlessSwitch, SwitchProps as HeadlessSwitchProps } from '@headlessui/react';
import { FunctionComponent, useState } from 'react';

const Switch: FunctionComponent<HeadlessSwitchProps<typeof HeadlessSwitch>> = ({
  checked,
  className,
  onChange,
  ...props
}) => {
  const [switchChecked, setSwitchChecked] = useState(checked);
  return (
    <HeadlessSwitch
      checked={switchChecked}
      onChange={(checked) => {
        setSwitchChecked(checked);
        onChange?.(checked);
      }}
      className={cs(
        className,
        switchChecked ? 'bg-cyan border-cyan-dark' : 'bg-70 border-50',
        'transition-color relative flex h-7 w-12 shrink-0 items-center rounded-lg border-2',
      )}
      {...props}
    >
      <span className="sr-only">Enable/Disable</span>
      <span
        className={cs(
          switchChecked ? 'translate-x-6 bg-white' : 'bg-10 translate-x-1',
          'inline-block h-4 w-4 transform rounded-[3px] transition-all',
        )}
      />
    </HeadlessSwitch>
  );
};

export default Switch;
