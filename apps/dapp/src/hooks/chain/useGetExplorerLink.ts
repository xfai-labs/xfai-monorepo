import { Transaction } from 'ethers';
import { useCallback } from 'react';
import { Token, getPoolFromToken } from '@xfai-labs/sdk';
import { useXfai } from '@dapp/context/XfaiProvider';

const useGetExplorerLink = () => {
  const xfai = useXfai();

  return useCallback(
    (address: Transaction['hash'], type: 'token2pool' | 'token' | 'tx') => {
      if (!address) {
        return undefined;
      }
      if (type === 'token2pool') {
        address = getPoolFromToken(xfai, Token(address)).address;
      }
      return `${xfai.chain.blockExplorerUrl}/${type === 'tx' ? 'tx' : 'address'}/${address}`;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xfai.chain.chainId],
  );
};

export default useGetExplorerLink;
