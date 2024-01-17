import { FunctionComponent } from 'react';
import { LogoIconAnimated } from '@xfai-labs/ui-components';
import loadingBackgroundImageURL from '@dapp/assets/loadingBackground.png';

const ModalProcessingImage: FunctionComponent = () => {
  return (
    <div className="relative">
      <LogoIconAnimated
        type="spinner"
        className="absolute left-1/2 top-1/2 h-auto w-[18%] shrink-0 -translate-x-1/2 -translate-y-1/2"
      />
      <img src={loadingBackgroundImageURL} alt="Processing Transaction" />
    </div>
  );
};

export default ModalProcessingImage;
