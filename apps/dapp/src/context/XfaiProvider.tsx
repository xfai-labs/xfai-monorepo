import useChain from '@dapp/hooks/chain/useChain';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { useConnectWallet } from '@web3-onboard/react';
import { Chain, Mainnet, Xfai } from '@xfai-labs/sdk';
import { providers } from 'ethers';
import { FC, ReactElement, createContext, useContext, useEffect, useState } from 'react';

const getProvider = (chain: Chain) => {
  const provider = new StaticJsonRpcProvider(chain.rpcUrl, chain.chainId);
  Object.defineProperty(provider, '_hasWallet', {
    value: false,
    writable: false,
  });
  return new Xfai(provider as StaticJsonRpcProvider & { _hasWallet: false }, chain);
};

const XfaiContext = createContext<Xfai>(getProvider(Mainnet));
export const useXfai = () => useContext(XfaiContext);

XfaiContext.displayName = 'XfaiContext';
const XfaiProvider: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [{ wallet }] = useConnectWallet();
  const chain = useChain();
  const [xfai, setXfai] = useState<Xfai>(getProvider(Mainnet));

  useEffect(() => {
    const connect = async () => {
      if (!chain) {
        setXfai(getProvider(Mainnet));
        return;
      }

      if (wallet) {
        const provider = new providers.Web3Provider(wallet.provider, chain.chainId);
        await provider.ready;
        setXfai(new Xfai(provider, chain));
      } else {
        setXfai(getProvider(chain));
      }
    };
    connect();
  }, [chain, wallet]);

  return <XfaiContext.Provider value={xfai} children={children} />;
};

export default XfaiProvider;
