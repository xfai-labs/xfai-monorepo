/* eslint-disable @typescript-eslint/no-empty-function */
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  createElement,
  FC,
  ComponentPropsWithoutRef,
  ReactNode,
  useMemo,
  Fragment,
} from 'react';
import WalletInfo from '@dapp/modals/WalletInfo';
import SettingsModal from '@dapp/modals/SettingsModal';
import SelectTokenModal, { SelectTokenModalProps } from '@dapp/modals/SelectTokenModal';
import SwapModal from '@dapp/modals/SwapModal';
import StakeModal from '@dapp/modals/StakeModal';
import SelectNetworkModal from '@dapp/modals/SelectNetworkModal';
import ManageImportedTokensModal from '@dapp/modals/ManageImportedTokensModal';
import UnknownTokenModal from '@dapp/modals/UnknownTokenModal';
import LiquidityAddModal from '@dapp/modals/Liquidity/LiquidityAddModal';
import LiquidityRedeemModal from '@dapp/modals/Liquidity/LiquidityRedeemModal';
import INFTHarvestModal from '@dapp/modals/INFT/INFTHarvestModal';
import INFTTransferModal from '@dapp/modals/INFT/INFTTransferModal';
import { ImportTokenModal, ImportTokenProps } from '@dapp/modals/ImportTokenModal';

import { Dialog, Transition } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import { ModalComponentBaseProps } from '@xfai-labs/ui-components';
import { useConnectWallet } from '@web3-onboard/react';

const Modals = {
  SwapModal,
  StakeModal,
  WalletInfo,
  SelectTokenModal,
  SettingsModal,
  ImportTokenModal,
  SelectNetworkModal,
  ManageImportedTokensModal,
  UnknownTokenModal,
  LiquidityAddModal,
  LiquidityRedeemModal,
  INFTHarvestModal,
  INFTTransferModal,
} as const;

type Modals = typeof Modals;

type ShowModalProps<T extends keyof Modals = keyof Modals> = {
  modal?: T;
  props?: Omit<ComponentPropsWithoutRef<Modals[T]>, keyof ModalComponentBaseProps>;
};

type GlobalModalContextValue = {
  showModal: <T extends keyof Modals>(
    modal: ShowModalProps<T>['modal'],
    props?: ShowModalProps<T>['props'],
  ) => void;
  showSettings: () => void;
  showManageTokens: () => void;
  showImportToken: (props: Omit<ImportTokenProps, keyof ModalComponentBaseProps>) => void;
  showSelectToken: (props: Omit<SelectTokenModalProps, keyof ModalComponentBaseProps>) => void;
};

const GlobalModalContext = createContext<GlobalModalContextValue>({
  showModal: () => {},
  showSettings: () => {},
  showManageTokens: () => {},
  showImportToken: () => {},
  showSelectToken: () => {},
});

export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [{ wallet }] = useConnectWallet();
  const accountAddress = useMemo(() => wallet?.accounts[0]?.address, [wallet?.accounts]);

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [importTokenOpen, setImportTokenOpen] = useState<ImportTokenProps | undefined>();
  const [selectTokenProps, setSelectTokenProps] = useState<SelectTokenModalProps | undefined>();
  const [manageTokensProps, setManageTokensProps] = useState<boolean>(false);
  const [modalName, setModalName] = useState<ShowModalProps['modal']>();
  const [modalState, setModalState] =
    useState<
      typeof modalName extends undefined
        ? undefined
        : ShowModalProps<NonNullable<typeof modalName>>['props']
    >();

  const showModal = (modal: typeof modalName, props?: typeof modalState) => {
    setModalName(modal);
    setModalState(props);
  };

  const showSettings = () => setSettingsOpen(true);
  const hideSettings = () => setSettingsOpen(false);

  const showImportToken = (props: ImportTokenProps) => setImportTokenOpen(props);
  const hideImportToken = () => setImportTokenOpen(undefined);

  const showSelectToken = (props: SelectTokenModalProps) => setSelectTokenProps(props);
  const hideSelectToken = () => setSelectTokenProps(undefined);

  const showManageTokens = () => setManageTokensProps(true);
  const hideManageTokens = () => setManageTokensProps(false);

  const hideModal = () => {
    setModalName(undefined);
    setModalState(undefined);
  };

  useEffect(() => {
    hideModal();
    hideSettings();
    hideImportToken();
    hideSelectToken();
  }, [location.pathname, accountAddress]);
  return (
    <GlobalModalContext.Provider
      value={{ showModal, showSettings, showImportToken, showSelectToken, showManageTokens }}
    >
      {children}
      <Modal
        modalState={{
          modal: modalName,
          props: modalState,
        }}
        hideModal={hideModal}
      />
      <Modal
        modalState={{
          modal: settingsOpen ? 'SettingsModal' : undefined,
        }}
        hideModal={hideSettings}
      />
      <Modal
        modalState={{
          modal: manageTokensProps ? 'ManageImportedTokensModal' : undefined,
        }}
        hideModal={hideManageTokens}
      />
      <Modal
        modalState={{
          modal: importTokenOpen ? 'ImportTokenModal' : undefined,
          props: importTokenOpen,
        }}
        hideModal={hideImportToken}
      />
      <Modal
        modalState={{
          modal: selectTokenProps ? 'SelectTokenModal' : undefined,
          props: selectTokenProps,
        }}
        hideModal={hideSelectToken}
      />
    </GlobalModalContext.Provider>
  );
};

const Modal = <T extends keyof Modals>({
  modalState,
  hideModal,
}: {
  modalState: ShowModalProps<T>;
  hideModal: () => void;
}) => {
  const [dismissible, setDismissible] = useState(true);
  const ref = useRef<HTMLElement>(null);

  return (
    <Transition appear show={!!modalState.modal} as={Fragment}>
      <Dialog
        initialFocus={ref}
        static
        as="div"
        className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden p-2.5"
        onClose={dismissible ? hideModal : (e) => null}
      >
        <Transition.Child
          as={'div'}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-black/90"
        />
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-200 transform"
          enterFrom="translate-y-1/2"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-200 transform"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-full opacity-0"
        >
          <Dialog.Panel className="w-full max-w-[25rem] overflow-hidden">
            {modalState.modal ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              createElement(Modals[modalState.modal], {
                ...modalState.props,
                hideModal,
                setDismissible,
              })
            ) : (
              <div className="bg-70 h-80 w-full rounded-md opacity-40"></div>
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
