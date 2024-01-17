import type { TokenInfo } from '@uniswap/token-lists';
import { INFT } from '@xfai-labs/sdk';
import type { ConnectedChain } from '@web3-onboard/core';
import { useContext, createContext, ReactElement, FC, useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useChain from '@dapp/hooks/chain/useChain';
import { noop } from 'lodash';

type LocalSwap = {
  tokenIn?: TokenInfo;
  tokenInAmount?: string;
  tokenOut?: TokenInfo;
  tokenOutAmount?: string;
};
export type ChainLocalSwap = Record<ConnectedChain['id'], LocalSwap>;

type LocalLiquidity = {
  target?: TokenInfo;
  targetAmount?: string;
  ethAmount?: string;
};
export type ChainLocalLiquidity = Record<ConnectedChain['id'], LocalLiquidity>;

type LocalStake = {
  tokenInAmount?: string;
  inft?: INFT;
};
export type ChainLocalStake = Record<ConnectedChain['id'], LocalStake>;

type LocalTransactionsContext = {
  swap: {
    chainLocalSwap: ChainLocalSwap;
    setLocalTokenIn: (token: TokenInfo | undefined) => void;
    setLocalTokenOut: (token: TokenInfo | undefined) => void;
    setLocalTokenAmounts: (inAmount?: string | undefined, outAmount?: string | undefined) => void;
    removeLocalSwap: () => void;
  };
  liquidity: {
    chainLocalLiquidity: ChainLocalLiquidity;
    setLocalTarget: (token: TokenInfo | undefined) => void;
    setLocalAmounts: (targetAmount?: string | undefined, ethAmount?: string | undefined) => void;
    removeLocalLiquidity: () => void;
  };
  stake: {
    chainLocalStake: ChainLocalStake;
    setLocalTokenInAmount: (amount?: string | undefined) => void;
    setLocalINFT: (inft?: INFT | undefined) => void;
    removeLocalStake: () => void;
  };
};

const LocalTransactionsContext = createContext<LocalTransactionsContext>({
  swap: {
    chainLocalSwap: {},
    setLocalTokenIn: noop,
    setLocalTokenOut: noop,
    setLocalTokenAmounts: noop,
    removeLocalSwap: noop,
  },
  liquidity: {
    chainLocalLiquidity: {},
    setLocalTarget: noop,
    setLocalAmounts: noop,
    removeLocalLiquidity: noop,
  },
  stake: {
    chainLocalStake: {},
    setLocalTokenInAmount: noop,
    setLocalINFT: noop,
    removeLocalStake: noop,
  },
});

export const useLocalTransactions = () => useContext(LocalTransactionsContext);

export function useChainLocalSwap() {
  const chain = useChain();
  const { chainLocalSwap } = useLocalTransactions().swap;
  if (!chain?.chainId) return {};
  return chainLocalSwap[chain.chainId] ?? {};
}

export function useChainLocalLiquidity() {
  const chain = useChain();
  const { chainLocalLiquidity } = useLocalTransactions().liquidity;
  if (!chain?.chainId) return {};
  return chainLocalLiquidity[chain.chainId] ?? {};
}

export function useChainLocalStake() {
  const chain = useChain();
  const { chainLocalStake } = useLocalTransactions().stake;
  if (!chain?.chainId) return {};
  return chainLocalStake[chain.chainId] ?? {};
}

export const LocalTransactionsProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const chain = useChain();

  // SWAP
  const [chainLocalSwap, setChainLocalSwap] = useLocalStorage<ChainLocalSwap>(
    'chain_local_swap',
    {},
  );

  const setLocalSwapTokenIn = useCallback(
    async (token: TokenInfo | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalSwap((chainLocalSwap) => {
        chainLocalSwap[chain.chainId] ??= {};
        chainLocalSwap[chain.chainId].tokenIn = token;

        return chainLocalSwap;
      });
    },
    [chain?.chainId, setChainLocalSwap],
  );

  const setLocalSwapTokenOut = useCallback(
    async (token: TokenInfo | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalSwap((chainLocalSwap) => {
        chainLocalSwap[chain.chainId] ??= {};
        chainLocalSwap[chain.chainId].tokenOut = token;

        return chainLocalSwap;
      });
    },
    [chain?.chainId, setChainLocalSwap],
  );

  const setLocalSwapTokenAmounts = useCallback(
    async (inAmount?: string | undefined, outAmount?: string | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalSwap((chainLocalSwap) => {
        chainLocalSwap[chain.chainId] ??= {};
        chainLocalSwap[chain.chainId].tokenInAmount = inAmount;
        chainLocalSwap[chain.chainId].tokenOutAmount = outAmount;

        return chainLocalSwap;
      });
    },
    [chain?.chainId, setChainLocalSwap],
  );

  const removeLocalSwap = useCallback(async () => {
    if (!chain?.chainId) return;

    setChainLocalSwap((chainLocalSwap) => {
      chainLocalSwap[chain.chainId] = {};
      return chainLocalSwap;
    });
  }, [chain?.chainId, setChainLocalSwap]);

  // LIQUIDITY
  const [chainLocalLiquidity, setChainLocalLiquidity] = useLocalStorage<ChainLocalLiquidity>(
    'chain_local_liquidity',
    {},
  );

  const setLocalLiquidityTarget = useCallback(
    async (token: TokenInfo | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalLiquidity((chainLocalLiquidity) => {
        chainLocalLiquidity[chain.chainId] ??= {};
        chainLocalLiquidity[chain.chainId].target = token;

        return chainLocalLiquidity;
      });
    },
    [chain?.chainId, setChainLocalLiquidity],
  );

  const setLocalLiquidityAmounts = useCallback(
    async (targetAmount?: string | undefined, ethAmount?: string | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalLiquidity((chainLocalLiquidity) => {
        chainLocalLiquidity[chain.chainId] ??= {};
        chainLocalLiquidity[chain.chainId].targetAmount = targetAmount;
        chainLocalLiquidity[chain.chainId].ethAmount = ethAmount;

        return chainLocalLiquidity;
      });
    },
    [chain?.chainId, setChainLocalLiquidity],
  );

  const removeLocalLiquidity = useCallback(async () => {
    if (!chain?.chainId) return;

    setChainLocalLiquidity((chainLocalLiquidity) => {
      chainLocalLiquidity[chain.chainId] = {};
      return chainLocalLiquidity;
    });
  }, [chain?.chainId, setChainLocalLiquidity]);

  // STAKE
  const [chainLocalStake, setChainLocalStake] = useLocalStorage<ChainLocalStake>(
    'chain_local_stake',
    {},
  );

  const setLocalStakeTokenInAmount = useCallback(
    async (amount: string | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalStake((chainLocalStake) => {
        chainLocalStake[chain.chainId] ??= {};
        chainLocalStake[chain.chainId].tokenInAmount = amount;

        return chainLocalStake;
      });
    },
    [chain?.chainId, setChainLocalStake],
  );

  const setLocalStakeINFT = useCallback(
    async (inft: INFT | undefined) => {
      if (!chain?.chainId) return;

      setChainLocalStake((chainLocalStake) => {
        chainLocalStake[chain.chainId] ??= {};
        chainLocalStake[chain.chainId].inft = inft;

        return chainLocalStake;
      });
    },
    [chain?.chainId, setChainLocalStake],
  );

  const removeLocalStake = useCallback(async () => {
    if (!chain?.chainId) return;

    setChainLocalStake((chainLocalStake) => {
      chainLocalStake[chain.chainId] = {};
      return chainLocalStake;
    });
  }, [chain?.chainId, setChainLocalStake]);

  return (
    <LocalTransactionsContext.Provider
      value={{
        swap: {
          chainLocalSwap,
          setLocalTokenIn: setLocalSwapTokenIn,
          setLocalTokenOut: setLocalSwapTokenOut,
          setLocalTokenAmounts: setLocalSwapTokenAmounts,
          removeLocalSwap,
        },
        liquidity: {
          chainLocalLiquidity,
          setLocalTarget: setLocalLiquidityTarget,
          setLocalAmounts: setLocalLiquidityAmounts,
          removeLocalLiquidity,
        },
        stake: {
          chainLocalStake,
          setLocalTokenInAmount: setLocalStakeTokenInAmount,
          setLocalINFT: setLocalStakeINFT,
          removeLocalStake,
        },
      }}
      children={children}
    />
  );
};
