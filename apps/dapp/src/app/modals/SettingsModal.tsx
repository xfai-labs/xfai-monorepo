import { useCallback, KeyboardEvent } from 'react';
import {
  Modal,
  ModalBodyGroup,
  FormTitle,
  SegmentedControl,
  useThemeContext,
  PresetItem,
  ModalComponent,
  IconArrowRight,
} from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import { useAppContext } from '@dapp/context/AppContext';
// import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { basisPointToPercent, percentToBasisPoint } from '@xfai-labs/sdk';

const inputValidation = function (event: KeyboardEvent<HTMLInputElement>) {
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

  if (
    currentValue.includes('.') ? currentValue.split('.')[1].length > 1 : currentValue.length > 1
  ) {
    if (event.key === '0') {
      // we don't wan't excess zeros
      event.preventDefault();
      return;
    }
  }

  if (
    currentValue.includes('.') ? currentValue.split('.')[1].length >= 2 : currentValue.length >= 2
  ) {
    event.preventDefault();
    return;
  }
};
const SettingsModal: ModalComponent = ({ hideModal, setDismissible }) => {
  const { ternaryDarkMode, setTernaryDarkMode } = useThemeContext();
  const { slippage, setSlippage, lpSlippage, setLpSlippage } = useAppContext();
  const { showManageTokens } = useGlobalModalContext();
  type TernaryDarkMode = typeof ternaryDarkMode;

  const onSlippageValue = useCallback(
    (v: string) => {
      try {
        const newSlippage = percentToBasisPoint(Number.parseFloat(v));
        setSlippage(newSlippage);
      } catch (e) {
        /* empty */
      }
    },
    [setSlippage],
  );
  const onLpSlippageValue = useCallback(
    (v: string) => {
      try {
        const newSlippage = percentToBasisPoint(Number.parseFloat(v));
        setLpSlippage(newSlippage);
      } catch (e) {
        /* empty */
      }
    },
    [setLpSlippage],
  );
  const themes: PresetItem<TernaryDarkMode>[] = [
    { label: Localization.Theme.LIGHT, value: 'light' },
    { label: Localization.Theme.DARK, value: 'dark' },
    { label: Localization.Theme.SYSTEM, value: 'system' },
  ];

  const slippages: PresetItem<string, string>[] = [
    { label: '0.1%', value: '0.10' },
    { label: '0.5%', value: '0.50' },
    { label: '1%', value: '1.00' },
  ];

  return (
    <Modal
      title={Localization.Label.SETTINGS}
      hideModal={hideModal}
      canDismiss={true}
      setDismissible={setDismissible}
    >
      <ModalBodyGroup>
        <FormTitle title={Localization.Label.THEME} size="small" />
        <SegmentedControl
          presets={themes}
          initialValue={ternaryDarkMode}
          onValue={setTernaryDarkMode}
        />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <FormTitle
          title={Localization.Label.SLIPPAGE_TOLERANCE}
          titleTooltip={Localization.Tooltip.SLIPPAGE_TOLERANCE}
          size="small"
          value={slippage && `${basisPointToPercent(slippage)}%`}
        />
        <SegmentedControl
          presets={slippages}
          initialValue={basisPointToPercent(slippage)}
          onValue={onSlippageValue}
          customInput={{
            unit: '%',
            placeholder: '0.15',
            inputMode: 'decimal',
            onKeyDown: inputValidation,
          }}
        />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <FormTitle
          title={Localization.Label.LP_SLIPPAGE_TOLERANCE}
          titleTooltip={Localization.Tooltip.SLIPPAGE_TOLERANCE}
          size="small"
          value={lpSlippage && `${basisPointToPercent(lpSlippage)}%`}
        />
        <SegmentedControl
          presets={slippages}
          initialValue={basisPointToPercent(lpSlippage)}
          onValue={onLpSlippageValue}
          customInput={{
            unit: '%',
            placeholder: '0.15',
            inputMode: 'decimal',
            onKeyDown: inputValidation,
          }}
        />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <button
          className={`bg-60 hover:bg-50 border-50 transition-color flex items-center gap-2.5 rounded-lg border p-4 pr-2.5 text-start`}
          type="button"
          onClick={() => showManageTokens()}
        >
          <h6 className="text-white-blue grow text-base font-medium leading-none">
            {Localization.Button.MANAGE_IMPORTED_TOKENS}
          </h6>
          <IconArrowRight className="fill-white-blue w-3.5" />
        </button>
      </ModalBodyGroup>
    </Modal>
  );
};

export default SettingsModal;
