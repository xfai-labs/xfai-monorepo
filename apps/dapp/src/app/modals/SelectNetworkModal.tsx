import {
  Modal,
  IconArrowRight,
  IconCheckMark,
  ModalComponent,
  Spinner,
} from '@xfai-labs/ui-components';
import { useSetChain } from '@web3-onboard/react';
import Localization from '@dapp/localization';
import { ReactElement, useEffect, useState } from 'react';
import { useAppContext } from '@dapp/context/AppContext';
import { Chains, SupportedChainIds } from '@xfai-labs/sdk';
import cs from 'classnames';
import { BigNumber } from 'ethers';

const SelectNetworkModal: ModalComponent = ({ hideModal, setDismissible }): ReactElement => {
  const { setChain, switchingChain, connectedChain } = useAppContext();
  const [currentChain, setCurrentChain] = useState<number>(connectedChain);
  const [{ chains }] = useSetChain();

  useEffect(() => {
    if (currentChain !== connectedChain) {
      hideModal();
    }
  }, [connectedChain, currentChain, hideModal]);

  return (
    <Modal
      title={Localization.Label.SWITCH_NETWORK}
      hideModal={hideModal}
      setDismissible={setDismissible}
      bodyClassName="!gap-2.5 relative"
      canDismiss={true}
    >
      {switchingChain && (
        <div className="bg-bg/80 absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {chains
        .filter((chain) => Chains[Number(chain.id) as SupportedChainIds].development === false)
        .map((chain) => (
          <button
            key={chain.id}
            className={`flex items-center gap-2.5 rounded-2xl p-1.5 pr-4 text-start ${
              BigNumber.from(chain.id).toNumber() === connectedChain ? 'bg-50' : 'bg-60'
            }`}
            type="button"
            disabled={BigNumber.from(chain.id).toNumber() === connectedChain || switchingChain}
            onClick={
              BigNumber.from(chain.id).toNumber() === connectedChain
                ? undefined
                : () => {
                    setCurrentChain(connectedChain);
                    setChain({ chainId: chain.id });
                  }
            }
          >
            {
              chain.icon && (
                <div
                  className={cs(
                    'bg-50 flex rounded-2xl p-2.5',
                    BigNumber.from(chain.id).toNumber() === connectedChain ? 'bg-40' : 'bg-50',
                    switchingChain && 'opacity-25 grayscale',
                  )}
                >
                  <img src={chain.icon} alt={chain.label} className="w-8 rounded-xl" />
                </div>
              )
              // )
            }
            <h6 className="text-white-blue grow text-lg font-medium leading-none">{chain.label}</h6>
            {BigNumber.from(chain.id).toNumber() !== connectedChain ? (
              <IconArrowRight className="fill-10 w-4" />
            ) : (
              <IconCheckMark className="fill-white-blue w-4" />
            )}
          </button>
        ))}
    </Modal>
  );
};

export default SelectNetworkModal;
