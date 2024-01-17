import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { Mainnet, SupportedChainIds, validateBasisPoint } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import { noop } from 'lodash';
import {
  ReactElement,
  FC,
  Dispatch,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

type SetChainOptions = {
  chainId: string;
  chainNamespace?: string;
};

const AppContext = createContext<{
  web3IsLoading: boolean;
  switchingChain: boolean;
  connectedChain: number;
  setChain: (options: SetChainOptions) => void;
  slippage: BigNumber;
  lpSlippage: BigNumber;
  setSlippage: Dispatch<BigNumber>;
  setLpSlippage: Dispatch<BigNumber>;
}>({
  web3IsLoading: true,
  switchingChain: false,
  connectedChain: Mainnet.chainId,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setChain: () => {},
  slippage: validateBasisPoint(100),
  lpSlippage: validateBasisPoint(100),
  setSlippage: noop,
  setLpSlippage: noop,
});

AppContext.displayName = 'AppContext';
export const useAppContext = () => useContext(AppContext);

export const AppContextComponent: FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [{ wallet }] = useConnectWallet();
  const [localChain, setLocalChain] = useLocalStorage<number>('local_chain', Mainnet.chainId);
  const [{ connectedChain, settingChain }, setChain] = useSetChain();

  useEffect(() => {
    if (!SupportedChainIds.includes(localChain)) {
      setLocalChain(Mainnet.chainId);
    }
  }, [localChain, setLocalChain]);

  const [slippageLocal, setSlippageLocal] = useLocalStorage('slippage-number', 50);
  const slippage = useMemo(() => validateBasisPoint(slippageLocal), [slippageLocal]);
  const setSlippage = useCallback(
    (slippage: BigNumber) => setSlippageLocal(validateBasisPoint(slippage).toNumber()),
    [setSlippageLocal],
  );

  const [lpSlippageLocal, setLpSlippageLocal] = useLocalStorage('lp-slippage-number', 50);
  const lpSlippage = useMemo(() => validateBasisPoint(lpSlippageLocal), [lpSlippageLocal]);
  const setLpSlippage = useCallback(
    (slippage: BigNumber) => setLpSlippageLocal(validateBasisPoint(slippage).toNumber()),
    [setLpSlippageLocal],
  );

  useEffect(() => {
    connectedChain && setLocalChain(BigNumber.from(connectedChain?.id).toNumber());
  }, [connectedChain, setLocalChain]);

  const connectedChainWrapper = useMemo(
    () => (connectedChain ? BigNumber.from(connectedChain?.id).toNumber() : localChain),
    [connectedChain, localChain],
  );

  const setChainWrapper = useCallback(
    (options: SetChainOptions) => {
      if (wallet) {
        setChain(options);
      }
      setLocalChain(BigNumber.from(options.chainId).toNumber());
    },
    [setChain, setLocalChain, wallet],
  );

  return (
    <AppContext.Provider
      value={{
        connectedChain: connectedChainWrapper,
        setChain: setChainWrapper,
        web3IsLoading: settingChain,
        switchingChain: !!connectedChain && settingChain,
        slippage,
        setSlippage,
        lpSlippage,
        setLpSlippage,
      }}
      children={children}
    />
  );
};
