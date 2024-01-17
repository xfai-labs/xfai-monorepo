import {
  Modal,
  ModalFooterItem,
  ModalBodyGroup,
  FormTitle,
  CopyToClipboard,
  ModalComponent,
} from '@xfai-labs/ui-components';
import { useMemo } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import Localization from '@dapp/localization';

const WalletInfo: ModalComponent<object> = ({ hideModal, setDismissible }) => {
  const [{ wallet }, _, disconnect] = useConnectWallet();
  const account = useMemo(() => wallet?.accounts[0], [wallet?.accounts]);

  const closeButton: ModalFooterItem = useMemo(
    () => ({
      text: Localization.Button.CLOSE,
      onClick: () => hideModal(),
    }),
    [hideModal],
  );

  const logoutButton: ModalFooterItem = useMemo(
    () => ({
      text: Localization.Button.LOGOUT,
      onClick: async () => {
        if (!wallet) return;
        hideModal();
        await disconnect(wallet);
      },
    }),
    [hideModal, disconnect, wallet],
  );

  if (!account || !wallet) {
    return null;
  }

  return (
    <Modal
      title={Localization.Label.YOUR_WALLET}
      hideModal={hideModal}
      canDismiss={true}
      setDismissible={setDismissible}
      footerButtons={[closeButton, logoutButton]}
    >
      <ModalBodyGroup>
        <div className="bg-60 flex items-center gap-2.5 rounded-2xl p-1.5 pr-4">
          {wallet.icon && (
            <div className="bg-50 flex rounded-2xl p-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center"
                dangerouslySetInnerHTML={{ __html: wallet.icon }}
              />
            </div>
          )}
          <div className="text-white-blue flex grow flex-col justify-center gap-1 text-lg font-medium leading-none">
            <h6 className="text-10 text-sm font-normal !leading-none">
              {Localization.Label.WALLET_PROVIDER}
            </h6>
            <p className="text-white-blue text-base font-medium !leading-none 2xl:text-lg">
              {wallet?.label}
            </p>
          </div>
        </div>
      </ModalBodyGroup>
      <ModalBodyGroup>
        <FormTitle title={Localization.Label.WALLET_ADDRESS} />
        <CopyToClipboard value={account.address} />
      </ModalBodyGroup>
    </Modal>
  );
};

export default WalletInfo;
