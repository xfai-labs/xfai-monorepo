import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import usePoolState from '../usePoolState';
import usePoolBalance from '../pool/usePoolBalance';
import usePoolTokenBalance from '../pool/usePoolTokenBalance';
import { TokenInfo } from '@uniswap/token-lists';
import usePoolSupply from '../pool/usePoolSupply';
import { RemoveLiquidity } from './useLiquidityRedeem';
import { useAppContext } from '@dapp/context/AppContext';
import { useXfai } from '@dapp/context/XfaiProvider';
import { toggleAmount } from '@dapp/utils/formatting';
import { QuoteBase, getAdjustedAmountOutput, isSharedToken, subtractSwapFee } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useGetPoolAllowance from '../pool/useGetPoolAllowance';

type Props = {
  target: TokenInfo;
  defaultSupplementary?: TokenInfo;
  setRedeemLiquidity: Dispatch<SetStateAction<RemoveLiquidity | undefined>>;
};
const usePrepareLiquidityRedeem = ({ target, defaultSupplementary, setRedeemLiquidity }: Props) => {
  const [inputType, setInputType] = useState<QuoteBase | 'percent'>();

  const xfai = useXfai();
  const { lpSlippage } = useAppContext();

  const [supplementary, setSupplementary] = useState<TokenInfo | undefined>(defaultSupplementary);

  const { data: availableLpAmount } = usePoolBalance(target);

  const { data: totalLpSupply } = usePoolSupply(target);
  const { data: poolTokenBalance } = usePoolTokenBalance(target);

  const { data: targetPoolState } = usePoolState(target);
  const { data: supplementaryPoolState } = usePoolState(supplementary);
  const { data: allowance } = useGetPoolAllowance(target);

  const [lpTokenRedeemAmount, setLpTokenRedeemAmount] = useState<BigNumber>(BigNumber.from(0));

  const redeemPercent = useMemo(
    () =>
      availableLpAmount
        ? Math.round(
            lpTokenRedeemAmount
              .mul(100 * 100)
              .div(availableLpAmount)
              .toNumber(),
          ) / 100
        : 0,
    [availableLpAmount, lpTokenRedeemAmount],
  );

  const setRedeemPercent = useCallback(
    (percent: number) => {
      if (!availableLpAmount) return;
      setLpTokenRedeemAmount(availableLpAmount.mul(Math.floor(percent * 100)).div(100 * 100));
    },
    [availableLpAmount],
  );

  const [targetAmountInput, setTargetAmountInput] = useState<string>();
  const [supplementaryAmountInput, setSupplementaryAmountInput] = useState<string>();

  const [targetError, setTargetError] = useState<string>();
  const [supplementaryError, setSupplementaryError] = useState<string>();

  const calculateTokenAmounts = useCallback((quoteType: QuoteBase, amount: undefined | string) => {
    if (amount === undefined) {
      setTargetAmountInput(undefined);
      setSupplementaryAmountInput(undefined);
      return;
    }
    setInputType(quoteType);

    if (quoteType === 'ETH') {
      setTargetAmountInput(amount);
      return;
    }

    setSupplementaryAmountInput(amount);
  }, []);

  const availableTargetLiquidity = useMemo(() => {
    if (!availableLpAmount || !poolTokenBalance || !totalLpSupply) return;
    return availableLpAmount.mul(poolTokenBalance).div(totalLpSupply);
  }, [availableLpAmount, poolTokenBalance, totalLpSupply]);

  const availableTargetWeight = useMemo(() => {
    if (!availableLpAmount || !totalLpSupply || !targetPoolState) return;
    return availableLpAmount.mul(targetPoolState.ethReserve).div(totalLpSupply);
  }, [availableLpAmount, targetPoolState, totalLpSupply]);

  const availableSupplementaryLiquidity = useMemo(() => {
    if (!supplementaryPoolState || !availableTargetWeight || !supplementary) return;
    if (isSharedToken(xfai, supplementary)) {
      return availableTargetWeight;
    }

    return subtractSwapFee(
      xfai,
      getAdjustedAmountOutput(supplementaryPoolState, availableTargetWeight),
    );
  }, [supplementaryPoolState, availableTargetWeight, xfai, supplementary]);

  useEffect(() => {
    setSupplementary(defaultSupplementary);
  }, [defaultSupplementary, defaultSupplementary?.chainId]);

  useEffect(() => {
    if (
      !target ||
      !supplementary ||
      !availableTargetLiquidity ||
      !availableSupplementaryLiquidity ||
      !supplementary ||
      !availableLpAmount
    )
      return;

    if (inputType === 'percent') {
      setTargetAmountInput(
        toggleAmount(
          availableTargetLiquidity.mul(lpTokenRedeemAmount).div(availableLpAmount),
          target,
        ),
      );

      setSupplementaryAmountInput(
        toggleAmount(
          availableSupplementaryLiquidity.mul(lpTokenRedeemAmount).div(availableLpAmount),
          supplementary,
        ),
      );
      return;
    }
  }, [
    availableLpAmount,
    availableSupplementaryLiquidity,
    availableTargetLiquidity,
    inputType,
    lpTokenRedeemAmount,
    supplementary,
    target,
  ]);

  useEffect(() => {
    setSupplementaryError(undefined);
    if (
      !target ||
      !availableTargetLiquidity ||
      !availableSupplementaryLiquidity ||
      !supplementary ||
      !availableLpAmount
    )
      return;

    if (inputType === 'Token') {
      if (!supplementaryAmountInput) return;

      const supplementaryAmount = toggleAmount(supplementaryAmountInput, supplementary);

      if (supplementaryAmount.gt(availableSupplementaryLiquidity)) {
        setSupplementaryError('Insufficient liquidity');
        return;
      }

      setTargetAmountInput(
        toggleAmount(
          supplementaryAmount.mul(availableTargetLiquidity).div(availableSupplementaryLiquidity),
          target,
          { keepSmall: true },
        ),
      );
      setLpTokenRedeemAmount(
        supplementaryAmount.mul(availableLpAmount).div(availableSupplementaryLiquidity),
      );
      return;
    }
  }, [
    availableLpAmount,
    availableSupplementaryLiquidity,
    availableTargetLiquidity,
    inputType,
    setRedeemPercent,
    supplementary,
    supplementaryAmountInput,
    supplementaryPoolState,
    target,
  ]);

  useEffect(() => {
    setTargetError(undefined);
    if (
      !target ||
      !availableTargetLiquidity ||
      !availableSupplementaryLiquidity ||
      !availableLpAmount ||
      !supplementary
    )
      return;

    if (inputType === 'ETH') {
      if (!targetAmountInput) return;
      const targetAmount = toggleAmount(targetAmountInput, target);
      if (targetAmount.gt(availableTargetLiquidity)) {
        setTargetError('Insufficient liquidity');
        return;
      }
      setSupplementaryAmountInput(
        toggleAmount(
          availableSupplementaryLiquidity.mul(targetAmount).div(availableTargetLiquidity),
          supplementary,
          { keepSmall: true },
        ),
      );
      setLpTokenRedeemAmount(targetAmount.mul(availableLpAmount).div(availableTargetLiquidity));
      return;
    }
  }, [
    availableLpAmount,
    availableSupplementaryLiquidity,
    availableTargetLiquidity,
    inputType,
    supplementary,
    target,
    targetAmountInput,
  ]);

  useEffect(() => {
    setRedeemLiquidity(undefined);
    if (!target || !supplementary || !allowance) return;
    if (!targetAmountInput || !supplementaryAmountInput) return;
    if (!lpTokenRedeemAmount) return;
    if (targetError || supplementaryError) return;
    if (lpTokenRedeemAmount.gt(allowance)) return;
    if (lpTokenRedeemAmount.isZero()) return;

    setRedeemLiquidity({
      lpAmount: lpTokenRedeemAmount,
      supplementary: {
        amount: toggleAmount(supplementaryAmountInput, supplementary),
        token: supplementary,
      },
      target: {
        amount: toggleAmount(targetAmountInput, target),
        token: target,
      },
      slippage: lpSlippage,
    });
  }, [
    allowance,
    lpTokenRedeemAmount,
    setRedeemLiquidity,
    lpSlippage,
    supplementary,
    supplementaryAmountInput,
    supplementaryError,
    target,
    targetAmountInput,
    targetError,
  ]);

  const targetHook = useMemo(
    () => ({
      token: target,
      amount: targetAmountInput,
      error: targetError,
      balance: availableTargetLiquidity,
      setAmount: (amount: string | undefined) => calculateTokenAmounts('ETH', amount),
    }),
    [target, targetAmountInput, targetError, availableTargetLiquidity, calculateTokenAmounts],
  );
  const supplementaryHook = useMemo(
    () => ({
      token: supplementary,
      amount: supplementaryAmountInput,
      balance: availableSupplementaryLiquidity,
      error: supplementaryError,
      setAmount: (amount: string | undefined) => calculateTokenAmounts('Token', amount),
    }),
    [
      supplementary,
      supplementaryAmountInput,
      availableSupplementaryLiquidity,
      supplementaryError,
      calculateTokenAmounts,
    ],
  );

  return {
    target: targetHook,
    supplementary: supplementaryHook,
    setSupplementary,
    redeemPercent,
    availableLpAmount,
    allowance,
    setRedeemPercent: (percent: number) => {
      setInputType('percent');
      setRedeemPercent(percent);
    },
  };
};
export default usePrepareLiquidityRedeem;
