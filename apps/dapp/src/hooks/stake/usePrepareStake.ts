import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { INFT, calculateShare, negativeSlippage } from '@xfai-labs/sdk';
import useINFTState from '../inft/useINFTState';
import Stake from '@dapp/types/Stake';
import { useAppContext } from '@dapp/context/AppContext';
import { useXfai } from '@dapp/context/XfaiProvider';
import useTokenBalance from '../tokens/useTokenBalance';
import Localization from '@dapp/localization';
import { toggleAmount } from '@dapp/utils/formatting';
import { useChainLocalStake, useLocalTransactions } from '@dapp/context/LocalTransactions';

type Props = {
  inft?: Stake['inft'];
};
const usePrepareStake = (props: Props = {}) => {
  const xfai = useXfai();
  const { slippage } = useAppContext();

  const { setLocalTokenInAmount, setLocalINFT } = useLocalTransactions().stake;
  const localStake = useChainLocalStake();
  const [error, setError] = useState<string>();
  const [inft, setInft] = useState<Stake['inft'] | undefined>(props.inft ?? localStake.inft);
  const [tokenInAmountInput, setTokenInAmountInput] = useState<string | undefined>(
    localStake.tokenInAmount,
  );
  const [minShares, setMinShareOut] = useState<BigNumber>();

  useEffect(() => {
    if (!props.inft) return;
    setLocalINFT(props.inft);
  }, [props.inft, setLocalINFT]);

  useEffect(() => {
    setTokenInAmountInput(localStake.tokenInAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xfai.chain.chainId]);

  useEffect(() => {
    if (props.inft) return;
    setInft(localStake.inft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xfai.chain.chainId]);

  const { data: tokenInBalance } = useTokenBalance('xfit');
  const { data: nftState, isLoading: nftStateIsLoading } = useINFTState();

  const tokenInAmount = useMemo(
    () => toggleAmount(tokenInAmountInput, 'xfit'),
    [tokenInAmountInput],
  );

  const tokenInHook = useMemo(
    () => ({
      balance: tokenInBalance,
      amount: tokenInAmountInput,
      setAmount: (amount: string | undefined) => {
        setTokenInAmountInput(amount);
        setLocalTokenInAmount(amount);
      },
    }),
    [tokenInBalance, tokenInAmountInput, setLocalTokenInAmount],
  );

  useEffect(() => {
    if (!tokenInAmount || !nftState) {
      setMinShareOut(undefined);
      return;
    }
    setMinShareOut(calculateShare(nftState, negativeSlippage(tokenInAmount, slippage)));
  }, [nftState, nftStateIsLoading, slippage, tokenInAmount]);

  const stake: undefined | Stake = useMemo(
    () =>
      nftState && tokenInAmount && minShares
        ? {
            amount: tokenInAmount,
            minShares,
            totalShares: nftState.shares,
            slippage,
            inft,
          }
        : undefined,
    [nftState, tokenInAmount, minShares, slippage, inft],
  );

  useEffect(() => {
    setError(undefined);
    if (!tokenInAmount || !tokenInBalance) {
      return;
    }

    if (tokenInAmount.lte(tokenInBalance)) {
      return;
    }

    setError(Localization.Error.INSUFFICIENT_BALANCE);
  }, [tokenInAmount, tokenInBalance]);

  const isReady = useMemo(() => !error && tokenInAmount?.gt(0), [error, tokenInAmount]);

  return {
    isLoading: nftStateIsLoading,
    isReady,
    tokenIn: tokenInHook,
    inft: inft,
    error,
    isError: false,
    setInft: (inft: undefined | INFT) => {
      setInft(inft);
      setLocalINFT(inft);
    },
    stake,
  };
};

export default usePrepareStake;
