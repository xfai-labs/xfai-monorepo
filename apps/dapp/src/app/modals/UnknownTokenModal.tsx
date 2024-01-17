import { Modal, ModalComponent } from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import Localization from '@dapp/localization';
import UnknownToken from './SelectTokenModal/Body/UnknownToken';

export type NoLiquidityPoolProps = {
  token: string | TokenInfo;
};

const UnknownTokenModal: ModalComponent<NoLiquidityPoolProps> = ({
  token,
  hideModal,
  setDismissible,
}) => {
  return (
    <Modal
      title={Localization.Label.IMPORT_TOKEN}
      hideModal={hideModal}
      setDismissible={setDismissible}
      canDismiss={true}
    >
      <UnknownToken tokenOrAddress={token} />
    </Modal>
  );
};

export default UnknownTokenModal;
