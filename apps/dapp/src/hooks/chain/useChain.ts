import { useAppContext } from '@dapp/context/AppContext';
import { Chains, SupportedChainIds } from '@xfai-labs/sdk';
import { useMemo } from 'react';

const useChain = () => {
  const { connectedChain } = useAppContext();

  return useMemo(() => {
    return Chains[connectedChain as SupportedChainIds];
  }, [connectedChain]);
};

export default useChain;
