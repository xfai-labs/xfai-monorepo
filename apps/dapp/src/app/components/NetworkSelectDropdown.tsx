import DropdownRC from 'rc-dropdown';
import ButtonNetwork from './ButtonNetwork';
import { DropdownList, DropdownItem, useScreenSizeChange } from '@xfai-labs/ui-components';
import { useAppContext } from '@dapp/context/AppContext';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { useSetChain } from '@web3-onboard/react';
import { FunctionComponent, useMemo } from 'react';
import { Chains, SupportedChainIds } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';

const DropdownNetworkSelect: FunctionComponent = () => {
  const { isMobile } = useScreenSizeChange();
  const { setChain, switchingChain, connectedChain } = useAppContext();
  const { showModal } = useGlobalModalContext();
  const [{ chains }] = useSetChain();

  const prodChains = useMemo(
    () =>
      chains.filter((chain) => Chains[Number(chain.id) as SupportedChainIds].development === false),
    [chains],
  );
  if (isMobile) {
    return <ButtonNetwork onClick={() => showModal('SelectNetworkModal')} />;
  }
  return (
    <DropdownRC
      trigger={['click']}
      placement="bottom"
      minOverlayWidthMatchTrigger={true}
      overlay={
        <DropdownList checkMark>
          {prodChains.map((chain) => {
            return (
              <DropdownItem
                key={chain.id}
                onClick={() =>
                  setChain({
                    chainId: chain.id,
                  })
                }
                iconURL={chain.icon}
                selected={BigNumber.from(chain.id).toNumber() === connectedChain}
                disabled={BigNumber.from(chain.id).toNumber() === connectedChain || switchingChain}
              >
                {chain.label}
              </DropdownItem>
            );
          })}
        </DropdownList>
      }
      prefixCls="dropdown"
    >
      <ButtonNetwork dropdown={prodChains.length > 1} />
    </DropdownRC>
  );
};

export default DropdownNetworkSelect;
