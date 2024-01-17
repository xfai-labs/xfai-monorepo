import Localization from '@dapp/localization';
import { Modal, ModalComponent } from '@xfai-labs/ui-components';

import { useChainSavedTokens, useSavedTokens } from '@dapp/context/SavedTokens';
import Token from '@dapp/components/Token';

const ManageImportedTokensModal: ModalComponent = ({ hideModal, setDismissible }) => {
  const savedTokens = useChainSavedTokens(true);
  const { removeSavedToken: removeToken } = useSavedTokens();

  return (
    <Modal
      title={Localization.Label.MANAGE_IMPORTED_TOKENS}
      hideModal={hideModal}
      canDismiss={true}
      setDismissible={setDismissible}
      bodyClassName="!p-0 !gap-0"
      expandBody
    >
      <Token.LocalList tokens={savedTokens} onTokenRemove={(token) => removeToken(token.address)} />
    </Modal>
  );
};

export default ManageImportedTokensModal;
