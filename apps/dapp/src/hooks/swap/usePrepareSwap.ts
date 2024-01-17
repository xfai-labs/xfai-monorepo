import { TradeType, isSharedToken } from '@xfai-labs/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import usePoolState from '../usePoolState';
import Swap from '@dapp/types/Swap';
import useSwapAmounts from './useSwapAmounts';
import { toggleAmount } from '@dapp/utils/formatting';
import { useAppContext } from '@dapp/context/AppContext';
import { TokenInfo } from '@uniswap/token-lists';
import { clone } from 'lodash';
import useTokenBalance from '../tokens/useTokenBalance';
import Localization from '@dapp/localization';
import { useXfai } from '@dapp/context/XfaiProvider';
import { useChainLocalSwap, useLocalTransactions } from '@dapp/context/LocalTransactions';

type Props = {
  defaultTokenIn?: TokenInfo;
};
const usePrepareSwap = (props: Props = {}) => {
  const xfai = useXfai();
  const { slippage } = useAppContext();

  const { setLocalTokenIn, setLocalTokenOut, setLocalTokenAmounts } = useLocalTransactions().swap;
  const localSwap = useChainLocalSwap();

  const [tradeType, setTradeType] = useState<Swap['type']>(
    !!localSwap.tokenInAmount && !localSwap.tokenInAmount
      ? TradeType.EXACT_OUTPUT
      : TradeType.EXACT_INPUT,
  );

  const [tokenIn, setTokenIn] = useState<undefined | TokenInfo>(
    localSwap.tokenIn ?? props.defaultTokenIn,
  );
  const [tokenOut, setTokenOut] = useState<undefined | TokenInfo>(localSwap.tokenOut);

  const [tokenInAmountInput, setTokenInAmountInput] = useState<string | undefined>(
    localSwap.tokenInAmount,
  );
  const [tokenOutAmountInput, setTokenOutAmountInput] = useState<string | undefined>(
    localSwap.tokenOutAmount,
  );

  const [tokenInError, setTokenInError] = useState<string>();
  const [tokenOutError, setTokenOutError] = useState<string>();

  useEffect(() => {
    if (xfai.chain.chainId !== tokenIn?.chainId) {
      setTokenIn(props.defaultTokenIn);
      setTradeType(!localSwap?.tokenOutAmount ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT);
      setTokenInAmountInput(localSwap?.tokenInAmount);
      setTokenOutAmountInput(localSwap?.tokenOutAmount);
      setTokenIn(localSwap?.tokenIn ?? props.defaultTokenIn);
      setTokenOut(localSwap?.tokenOut);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xfai.chain?.chainId]);

  const wethSwap = useMemo(() => {
    return isSharedToken(xfai, tokenIn) && isSharedToken(xfai, tokenOut);
  }, [tokenIn, tokenOut, xfai]);

  const tokenInAmount = useMemo(
    () => (tokenInAmountInput ? toggleAmount(tokenInAmountInput, tokenIn!) : undefined),
    [tokenIn, tokenInAmountInput],
  );

  const { data: tokenInBalance } = useTokenBalance(tokenIn);
  const { data: tokenOutBalance } = useTokenBalance(tokenOut);

  const { data: poolInState } = usePoolState(tokenIn);
  const { data: poolOutState } = usePoolState(tokenOut);

  const { mutateAsync: swapAmount } = useSwapAmounts();

  const calculateTokenAmounts = useCallback(
    (tradeType: TradeType, amount: undefined | string) => {
      if (amount === undefined) {
        setTokenInAmountInput(undefined);
        setTokenOutAmountInput(undefined);

        setLocalTokenAmounts(undefined, undefined);
        return;
      }

      if (tradeType === TradeType.EXACT_INPUT) {
        setTokenInAmountInput(amount);
        setTokenOutAmountInput(undefined);

        setLocalTokenAmounts(amount, undefined);
      } else {
        setTokenInAmountInput(undefined);
        setTokenOutAmountInput(amount);

        setLocalTokenAmounts(undefined, amount);
      }
      setTradeType(tradeType);
    },
    [setLocalTokenAmounts],
  );

  useEffect(() => {
    /**
     ****************************
     * EXACT_OUTPUT Calculation *
     ****************************
     */
    (async () => {
      if (!tokenOutAmountInput || tradeType !== TradeType.EXACT_OUTPUT) return;
      setTokenOutError(undefined);

      if (!poolInState || !poolOutState || !tokenIn || !tokenOut) return;
      if (wethSwap) {
        setTokenInAmountInput(tokenOutAmountInput);
        return;
      }

      const output = toggleAmount(tokenOutAmountInput, tokenOut);
      try {
        const calculatedInputAmount = await swapAmount({
          tradeType: TradeType.EXACT_OUTPUT,
          tokenIn: {
            token: tokenIn,
            state: poolInState,
          },
          tokenOut: {
            token: tokenOut,
            state: poolOutState,
          },
          amount: output,
        });
        setTokenInAmountInput(
          toggleAmount(calculatedInputAmount.amount, tokenIn, {
            roundingMode: 'up',
            keepSmall: true,
          }),
        );
      } catch (e) {
        if (e instanceof Error && e.name === 'INSUFFICIENT_DEX_LIQUIDITY') {
          setTokenOutError(Localization.Error.INSUFFICIENT_DEX_LIQUIDITY);
        }
      }
    })();
  }, [
    poolInState,
    poolOutState,
    swapAmount,
    tokenIn,
    tokenOut,
    tokenOutAmountInput,
    tradeType,
    wethSwap,
    xfai,
  ]);

  useEffect(() => {
    /**
     ***************************
     * EXACT_INPUT Calculation *
     ***************************
     */
    (async () => {
      if (!tokenInAmountInput || tradeType !== TradeType.EXACT_INPUT) return;
      setTokenOutError(undefined);

      if (!poolInState || !poolOutState || !tokenIn || !tokenOut) return;

      if (wethSwap) {
        setTokenOutAmountInput(tokenInAmountInput);
        return;
      }
      const input = toggleAmount(tokenInAmountInput, tokenIn);
      const calculatedOutputAmount = await swapAmount({
        tradeType: TradeType.EXACT_INPUT,
        tokenIn: {
          token: tokenIn,
          state: poolInState,
        },
        tokenOut: {
          token: tokenOut,
          state: poolOutState,
        },
        amount: input,
      });
      setTokenOutAmountInput(
        toggleAmount(calculatedOutputAmount.amount, tokenOut, {
          roundingMode: 'down',
          keepSmall: true,
        }),
      );
    })();
  }, [
    poolInState,
    poolOutState,
    swapAmount,
    tokenIn,
    tokenInAmountInput,
    tokenOut,
    tradeType,
    wethSwap,
    xfai,
  ]);

  useEffect(() => {
    setTokenInError(undefined);
    if (!tokenInAmount || !tokenInBalance) {
      return;
    }

    if (tokenInAmount.gt(tokenInBalance)) {
      setTokenInError(Localization.Error.INSUFFICIENT_BALANCE);
    }
  }, [tokenInAmount, tokenInBalance]);

  const trade = useMemo((): Swap | undefined => {
    // Both inputs need to be present
    if (!tokenInAmount || !tokenOutAmountInput) return undefined;

    // Token in amount cannot be zero
    if (!tokenInAmount.gt(0)) return undefined;

    return {
      wethSwap,
      type: tradeType,
      tokenIn: {
        token: tokenIn!,
        amount: tokenInAmount,
      },
      tokenOut: {
        token: tokenOut!,
        amount: toggleAmount(tokenOutAmountInput, tokenOut!),
      },
      slippage,
    };
  }, [tokenInAmount, tokenOutAmountInput, wethSwap, tradeType, tokenIn, tokenOut, slippage]);

  const tokenInHook = useMemo(
    () => ({
      token: tokenIn,
      error: tokenInError,
      amount: tokenInAmountInput,
      balance: tokenInBalance,
      setAmount: (amount: string | undefined) =>
        calculateTokenAmounts(TradeType.EXACT_INPUT, amount),
    }),
    [tokenIn, tokenInError, tokenInAmountInput, tokenInBalance, calculateTokenAmounts],
  );
  const tokenOutHook = useMemo(
    () => ({
      token: tokenOut,
      error: tokenOutError,
      balance: tokenOutBalance,
      amount: tokenOutAmountInput,
      setAmount: (amount: string | undefined) =>
        calculateTokenAmounts(TradeType.EXACT_OUTPUT, amount),
    }),
    [tokenOut, tokenOutError, tokenOutBalance, tokenOutAmountInput, calculateTokenAmounts],
  );

  const swapTokenOrder = useCallback(() => {
    const tokenInCopy = clone(tokenIn);
    setTokenIn(clone(tokenOut));
    setLocalTokenIn(clone(tokenOut));
    setTokenInAmountInput(clone(tokenOutAmountInput));
    setLocalTokenAmounts(tokenInAmountInput);
    setTokenOut(tokenInCopy);
    setLocalTokenOut(tokenInCopy);
  }, [
    setLocalTokenAmounts,
    setLocalTokenIn,
    setLocalTokenOut,
    tokenIn,
    tokenInAmountInput,
    tokenOut,
    tokenOutAmountInput,
  ]);

  return {
    tokenIn: tokenInHook,
    tokenOut: tokenOutHook,
    setTokenIn: (tokenIn: TokenInfo | undefined) => {
      setTokenIn(tokenIn);
      setLocalTokenIn(tokenIn);
    },
    setTokenOut: (tokenOut: TokenInfo | undefined) => {
      setTokenOut(tokenOut);
      setLocalTokenOut(tokenOut);
    },
    swapTokenOrder,
    trade,
  };
};

export default usePrepareSwap;
