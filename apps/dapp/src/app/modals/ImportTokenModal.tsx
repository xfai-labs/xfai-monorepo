import {
  Modal,
  ModalHeaderItem,
  ModalFooterItem,
  InfoBox,
  IconSettings,
  IconArrowLeft,
  ModalComponent,
} from '@xfai-labs/ui-components';
import { useUnknownTokenResult } from '@dapp/hooks/tokens/useUnknownToken';
import Localization from '@dapp/localization';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import Token from '@dapp/components/Token';

export type ImportTokenProps = {
  token: useUnknownTokenResult['token'];
  onConfirm: ({ hideImportTokenModal }: { hideImportTokenModal: () => void }) => void;
};

export const ImportTokenModal: ModalComponent<ImportTokenProps> = ({
  onConfirm,
  token,
  hideModal,
  setDismissible,
}) => {
  const { showSettings } = useGlobalModalContext();

  const backButton: ModalHeaderItem = {
    icon: IconArrowLeft,
    onClick: hideModal,
  };

  const settingsButton: ModalHeaderItem = {
    icon: IconSettings,
    onClick: showSettings,
  };

  const importButton: ModalFooterItem = {
    text: Localization.Button.IMPORT,
    onClick: () => {
      onConfirm({
        hideImportTokenModal: hideModal,
      });
    },
  };

  return (
    <Modal
      title={Localization.Label.IMPORT_TOKEN}
      hideModal={hideModal}
      setDismissible={setDismissible}
      headerLeftButton={backButton}
      headerRightButton={settingsButton}
      footerButtons={[importButton]}
      canDismiss={true}
    >
      <>
        <InfoBox iconColor="fill-red">{Localization.Message.IMPORT_TOKEN}</InfoBox>
        <Token.AddressBox token={token} />
      </>
    </Modal>
  );
};
