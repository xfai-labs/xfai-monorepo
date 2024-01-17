import { FunctionComponent } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import loadingBackgroundImageURL from '@dapp/assets/loadingBackground.png';
import './index.css';

const ModalConfirmingImage: FunctionComponent = () => {
  const [{ wallet }] = useConnectWallet();
  return (
    <div className="modal-confirming relative">
      {wallet?.icon && (
        <span
          className="absolute left-1/2 top-1/2 w-[16%] -translate-x-1/2 -translate-y-1/2"
          dangerouslySetInnerHTML={{ __html: wallet.icon }}
        ></span>
      )}
      <svg className="modal-confirming-spinner" viewBox="0 0 60 60">
        <rect x="4" y="4" width="52" height="52" rx="3" ry="3" />
      </svg>
      <img src={loadingBackgroundImageURL} alt="Transaction Confirmation Pending" />
    </div>
  );
};

export default ModalConfirmingImage;
