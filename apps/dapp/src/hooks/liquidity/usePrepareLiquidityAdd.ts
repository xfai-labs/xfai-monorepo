import { useCallback, useEffect, useMemo, useState } from 'react';
import usePoolState from '../usePoolState';
import useQuoteTokens from '../useQuoteTokens';
import { toggleAmount } from '@dapp/utils/formatting';
import { AddLiquidity } from './useLiquidityAdd';
import { TokenInfo } from '@uniswap/token-lists';
import useTokenBalance from '../tokens/useTokenBalance';
import Localization from '@dapp/localization';
import { useXfai } from '@dapp/context/XfaiProvider';
import { QuoteBase } from '@xfai-labs/sdk';
import { useChainLocalLiquidity, useLocalTransactions } from '@dapp/context/LocalTransactions';
import useChain from '@dapp/hooks/chain/useChain';
import { useCoingeckoPrice } from './useCoingeckoPrice';

type Props = {
  defaultTarget?: TokenInfo;
  preselectedTarget?: TokenInfo;
};

const usePrepareLiquidityAdd = (props: Props = {}) => {
  const [error, setError] = useState<string>();
  const xfai = useXfai();
  const chain = useChain();

  const { setLocalTarget, setLocalAmounts } = useLocalTransactions().liquidity;
  const localLiquidity = useChainLocalLiquidity();

  const [quoteType, setQuoteType] = useState<QuoteBase>();

  const [poolShare, setPoolShare] = useState<string>('0');

  const [targetAmountInput, setTargetAmountInput] = useState<string | undefined>();
  const [target, setTarget] = useState<TokenInfo | undefined>();
  const [ethAmountInput, setEthAmountInput] = useState<string | undefined>();

  const [targetError, setTargetError] = useState<string>();
  const [supplementaryError, setSupplementaryError] = useState<string>();

  const supplementary = useMemo(() => xfai.nativeToken, [xfai]);

  useEffect(() => {
    if (chain?.chainId !== target?.chainId) {
      setQuoteType(localLiquidity.targetAmount ? 'Token' : 'ETH');
      setTargetAmountInput(localLiquidity.targetAmount);
      setEthAmountInput(localLiquidity.ethAmount);
      setTarget(props.preselectedTarget ?? localLiquidity?.target ?? props.defaultTarget);
    }
  }, [
    chain?.chainId,
    localLiquidity.ethAmount,
    localLiquidity?.target,
    localLiquidity.targetAmount,
    props.defaultTarget,
    props.preselectedTarget,
    target?.chainId,
  ]);

  useEffect(() => {
    if (chain?.chainId === target?.chainId) {
      setLocalTarget(target);
    }
  }, [chain?.chainId, setLocalTarget, target]);

  const { data: targetPoolStateXfai, isError } = usePoolState(target);

  const { data: coinGeckoState, isSuccess } = useCoingeckoPrice(target, isError);

  const targetPoolState = useMemo(
    () => targetPoolStateXfai ?? coinGeckoState,
    [targetPoolStateXfai, coinGeckoState],
  );

  const { data: targetBalance } = useTokenBalance(target);
  const { data: supplementaryBalance } = useTokenBalance(supplementary);

  const { mutateAsync: quote } = useQuoteTokens();

  const targetAmount = useMemo(
    () =>
      target && targetAmountInput
        ? toggleAmount(targetAmountInput, target, { keepSmall: true })
        : undefined,
    [target, targetAmountInput],
  );

  const calculateTokenAmounts = useCallback(
    (quoteType: QuoteBase, amount: undefined | string) => {
      if (amount === undefined) {
        setTargetAmountInput(undefined);
        setEthAmountInput(undefined);
        setLocalAmounts(undefined, undefined);
        return;
      }

      if (quoteType === 'Token') {
        setTargetAmountInput(amount);
        setLocalAmounts(amount, undefined);
      } else {
        setEthAmountInput(amount);
        setLocalAmounts(undefined, amount);
      }
      setQuoteType(quoteType);
    },
    [setLocalAmounts],
  );

  const targetHook = useMemo(
    () => ({
      token: target,
      amount: targetAmountInput,
      error: targetError,
      balance: targetBalance,
      setAmount: (amount: string | undefined) => calculateTokenAmounts('Token', amount),
    }),
    [target, targetAmountInput, targetError, targetBalance, calculateTokenAmounts],
  );
  const ethHook = useMemo(
    () => ({
      token: supplementary,
      amount: ethAmountInput,
      balance: supplementaryBalance,
      error: supplementaryError,
      setAmount: (amount: string | undefined) => calculateTokenAmounts('ETH', amount),
    }),
    [
      supplementary,
      ethAmountInput,
      supplementaryBalance,
      supplementaryError,
      calculateTokenAmounts,
    ],
  );

  useEffect(() => {
    /**
     *********************************************
     * Calculate ETH amount given tokenIn amount *
     *********************************************
     */
    (async () => {
      if (quoteType !== 'Token' || !targetAmountInput) return;
      setPoolShare('0');
      if (!targetPoolState || !target) return;

      try {
        const input = toggleAmount(targetAmountInput, target);
        const result = await quote({
          type: 'Token',
          token: {
            token: target,
            state: targetPoolState,
          },
          amount: input,
        });
        setEthAmountInput(
          toggleAmount(result.ethIn, 'eth', { roundingMode: 'up', keepSmall: true }),
        );
        if (result.ethIn) {
          setPoolShare(
            `${
              result.ethIn
                .mul(100 * 100)
                .div(targetPoolState.ethReserve.add(result.ethIn))
                .toNumber() / 100
            }`,
          );
        }
        setError(undefined);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    })();
  }, [quote, quoteType, target, targetPoolState, targetAmountInput]);

  useEffect(() => {
    /**
     *********************************************
     * Calculate tokenIn amount given ETH amount *
     *********************************************
     */
    (async () => {
      if (quoteType !== 'ETH' || !ethAmountInput) return;
      setPoolShare('0');
      if (!targetPoolState || !target) return;
      try {
        const input = toggleAmount(ethAmountInput, 'eth');
        const result = await quote({
          type: 'ETH',
          token: {
            token: target,
            state: targetPoolState,
          },
          amount: input,
        });
        setTargetAmountInput(
          toggleAmount(result.tokenIn, target, { roundingMode: 'down', keepSmall: true }),
        );

        if (result.ethIn) {
          setPoolShare(
            `${
              result.ethIn
                .mul(100 * 100)
                .div(targetPoolState.ethReserve.add(result.ethIn))
                .toNumber() / 100
            }`,
          );
        }
        setError(undefined);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    })();
  }, [quote, quoteType, target, targetPoolState, ethAmountInput]);

  useEffect(() => {
    setTargetError(undefined);
    if (!targetAmount || !targetBalance) {
      return;
    }

    if (targetAmount.gt(targetBalance)) {
      setTargetError(Localization.Error.INSUFFICIENT_BALANCE);
    }
  }, [targetAmount, targetBalance]);

  useEffect(() => {
    setSupplementaryError(undefined);
    if (!ethAmountInput || !supplementaryBalance) {
      return;
    }

    if (toggleAmount(ethAmountInput, 'eth').gt(supplementaryBalance)) {
      setSupplementaryError(Localization.Error.INSUFFICIENT_BALANCE);
    }
  }, [ethAmountInput, supplementaryBalance, targetAmount, targetBalance]);

  const addLiquidity: undefined | AddLiquidity = useMemo(
    () =>
      target && ethAmountInput && targetAmount && targetAmount.gt(0)
        ? {
            ethAmount: toggleAmount(ethAmountInput, 'eth'),
            target: {
              token: target,
              amount: targetAmount,
            },
            poolShare: poolShare,
          }
        : undefined,
    [target, ethAmountInput, targetAmount, poolShare],
  );

  return {
    target: targetHook,
    eth: ethHook,
    error,
    poolShare,
    setTarget,
    addLiquidity,
    quoteType,
    isUsingCoingecko: isSuccess,
  };
};
export default usePrepareLiquidityAdd;
