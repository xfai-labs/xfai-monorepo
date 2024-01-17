import { useState, FC, Dispatch, SetStateAction, FunctionComponent, useMemo } from 'react';
import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import ConfirmationModal from '@dapp/components/Shared/ConfirmationModal';
import Localization from '@dapp/localization';
import { FormTitle, ModalComponent, ModalBodyGroup, Slider } from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import {
  useLiquidityRedeem,
  RemoveLiquidity,
  useLiquidityRedeemGasEstimate,
} from '@dapp/hooks/liquidity/useLiquidityRedeem';
import Token from '@dapp/components/Token';
import usePrepareLiquidityRedeem from '@dapp/hooks/liquidity/usePrepareLiquidityRedeem';
import { toggleAmount } from '@dapp/utils/formatting';
import { GasEstimate } from '@dapp/components/GasEstimate';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { useXfai } from '@dapp/context/XfaiProvider';
import AmountBox from '@dapp/components/Shared/AmountBox';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import ApprovePoolAllowance from '@dapp/components/Liquidity/ApprovePoolAllowance';
import { AnimatePresence } from 'framer-motion';
import { UseWeb3EstimateResult } from '@dapp/hooks/meta/useWeb3Estimate';

const LiquidityRedeemModal: ModalComponent<{
  token: TokenInfo;
}> = ({ token, hideModal, setDismissible }) => {
  const [redeemLiquidity, setRedeemLiquidity] = useState<RemoveLiquidity>();
  const estimate = useLiquidityRedeemGasEstimate(redeemLiquidity);

  const mutation = useLiquidityRedeem();

  return (
    <ConfirmationModal.Base
      mutation={mutation}
      setDismissible={setDismissible}
      mutationInput={redeemLiquidity}
      title={`${Localization.Liquidity.Manage.Label.REDEEM} ${token.symbol} ${Localization.Liquidity.Manage.Label.LIQUIDITY}`}
      hideModal={hideModal}
      confirm={
        <LiquidityRedeemConfirmModal
          setRedeemLiquidity={setRedeemLiquidity}
          target={token}
          estimate={estimate}
        />
      }
      confirming={({ input: redeemLiquidity }) => (
        <ConfirmationModal.Body
          title={Localization.Message.WAITING_FOR_CONFIRMATION}
          className="text-center"
        >
          <div className="flex flex-col gap-1.5">
            <h5 className="text-base md:text-lg">
              {Localization.Liquidity.Manage.Label.REDEEMING}{' '}
              {toggleAmount(redeemLiquidity.target.amount, redeemLiquidity.target.token)}
            </h5>
            <p>{Localization.Message.CONFIRM_TRANSACTION_IN_WALLET}</p>
          </div>
        </ConfirmationModal.Body>
      )}
      processing={({ input: redeemLiquidity, result }) => (
        <ConfirmationModal.Body
          title={`${Localization.Liquidity.Manage.Label.REDEEMING} ${token.symbol} ${Localization.Liquidity.Manage.Label.LIQUIDITY}`}
        >
          <LiquidityRedeemDetails
            redeemLiquidity={redeemLiquidity}
            estimate={estimate}
            result={result}
          />
        </ConfirmationModal.Body>
      )}
      success={({ input: redeemLiquidity, receipt }) => (
        <ConfirmationModal.Body
          title={`${token.symbol} ${Localization.Liquidity.Manage.Label.LIQUIDITY} ${Localization.Liquidity.Manage.Label.REDEEM} ${Localization.Label.SUCCESSFUL}`}
          className="text-center"
        >
          <LiquidityRedeemDetails
            redeemLiquidity={redeemLiquidity}
            estimate={estimate}
            receipt={receipt}
          />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={`${token.symbol} ${Localization.Liquidity.Manage.Label.LIQUIDITY} ${Localization.Liquidity.Manage.Label.REDEEM} ${Localization.Label.FAILED}`}
    />
  );
};

const LiquidityRedeemConfirmModal: FC<{
  target: TokenInfo;
  setRedeemLiquidity: Dispatch<SetStateAction<RemoveLiquidity | undefined>>;
  estimate: UseWeb3EstimateResult;
}> = ({ setRedeemLiquidity, target: targetToken, estimate }) => {
  const { showSelectToken } = useGlobalModalContext();
  const xfai = useXfai();

  const {
    target,
    supplementary,
    setSupplementary,
    redeemPercent,
    setRedeemPercent,
    availableLpAmount,
    allowance,
  } = usePrepareLiquidityRedeem({
    target: targetToken,
    defaultSupplementary: xfai.nativeToken,
    setRedeemLiquidity,
  });

  const targetFiat = useFiatValue(target.token);
  const supplementaryFiat = useFiatValue(supplementary.token);

  const allowancePercent = useMemo(() => {
    if (!availableLpAmount || !allowance) return 0;

    const percent = allowance.mul(100 * 100).div(availableLpAmount);
    if (percent.gt(100 * 100)) return 100.0;

    return percent.toNumber() / 100;
  }, [allowance, availableLpAmount]);

  return (
    <>
      <ModalBodyGroup>
        <AmountBox
          tokenSelect={false}
          tokenSelectProps={{ token: target.token, amountFiat: true }}
          tokenAmount={target.amount}
          balance={target.balance}
          setTokenAmount={target.setAmount}
          error={
            allowancePercent === 0
              ? Localization.Liquidity.Manage.Label.NO_LP_ALLOWANCE
              : target.error
          }
          errorType={allowancePercent === 0 ? 'warning' : 'error'}
          fiatValue={targetFiat(target.amount)}
          inputDisabled={allowancePercent === 0}
        />
      </ModalBodyGroup>
      <ModalBodyGroup title={Localization.Liquidity.Manage.Label.SECONDARY_TOKEN_TO_EXIT}>
        <AmountBox
          tokenSelectProps={{
            button: false,
            token: supplementary.token,
            amountFiat: true,
            onClick: () =>
              showSelectToken({
                includeNativeTokens: 'native',
                onToken: (token) => setSupplementary(token),
                filter: (token) => token.address !== target.token.address,
              }),
          }}
          tokenAmount={supplementary.amount}
          setTokenAmount={supplementary.setAmount}
          balance={supplementary.balance}
          error={
            allowancePercent === 0
              ? Localization.Liquidity.Manage.Label.NO_LP_ALLOWANCE
              : supplementary.error
          }
          fiatValue={supplementaryFiat(supplementary.amount)}
          errorType={allowancePercent === 0 ? 'warning' : 'error'}
          inputDisabled={allowancePercent === 0}
        />
      </ModalBodyGroup>
      <ModalBodyGroup className="pt-1">
        <FormTitle
          title={Localization.Liquidity.Manage.Label.REDEEM_AMOUNT}
          titleTooltip={Localization.Liquidity.Manage.Tooltip.REDEEM_AMOUNT}
          size="medium"
          value={`${redeemPercent}%`}
        />
        <div className="flex flex-col">
          {allowancePercent !== 0 && (
            <Slider
              step={1}
              value={[redeemPercent]}
              limit={allowancePercent}
              limitMarkerText={Localization.Label.ALLOWANCE}
              limitMarkerTooltip="Optional Tooltip"
              disabled={allowancePercent === 0}
              onValueChange={(value) => setRedeemPercent(value[0])}
            />
          )}
          <AnimatePresence>
            {(allowancePercent === 0 || redeemPercent > allowancePercent) && (
              <ApprovePoolAllowance token={targetToken} />
            )}
          </AnimatePresence>
        </div>
      </ModalBodyGroup>
      <ModalBodyGroup>
        {false && (
          <FormTitle
            lightTitle
            size="small"
            title={Localization.Liquidity.Add.Label.YOUR_TOTAL_LIQUIDITY}
            titleTooltip={Localization.Liquidity.Add.Tooltip.YOUR_TOTAL_LIQUIDITY}
            value={''}
          />
        )}
        <GasEstimate estimate={estimate} />
      </ModalBodyGroup>
    </>
  );
};

const LiquidityRedeemDetails: FunctionComponent<{
  redeemLiquidity: RemoveLiquidity;
  estimate: UseWeb3EstimateResult;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
}> = ({ redeemLiquidity, estimate, result, receipt }) => {
  return (
    <>
      <ModalBodyGroup title={Localization.Liquidity.Add.Label.PRIMARY_TOKEN_AND_AMOUNT}>
        <Token.AmountBox
          token={redeemLiquidity.target.token}
          amount={redeemLiquidity.target.amount}
          amountFiat
        />
      </ModalBodyGroup>
      <ModalBodyGroup title={Localization.Liquidity.Add.Label.SECONDARY_TOKEN_AND_AMOUNT}>
        <Token.AmountBox
          token={redeemLiquidity.supplementary.token}
          amount={redeemLiquidity.supplementary.amount}
          amountFiat
        />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <GasEstimate estimate={estimate} result={result} receipt={receipt} />
      </ModalBodyGroup>
    </>
  );
};

export default LiquidityRedeemModal;
