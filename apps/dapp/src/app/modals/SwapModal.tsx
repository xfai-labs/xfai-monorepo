import ConfirmationModal, {
  type ConfirmationModalProps,
} from '@dapp/components/Shared/ConfirmationModal';
import Token from '@dapp/components/Token';
import Localization from '@dapp/localization';
import { useSwap, useSwapGasEstimate } from '@dapp/hooks/swap/useSwap';
import Swap from '@dapp/types/Swap';
import { FormTitle, ModalBodyGroup, ModalComponent } from '@xfai-labs/ui-components';
import { toggleAmount } from '@dapp/utils/formatting';
import { deriveTradeExchangeRates } from '@dapp/utils/trade';
import type { FunctionComponent } from 'react';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { GasEstimate } from '@dapp/components/GasEstimate';
import { basisPointToPercent } from '@xfai-labs/sdk';

const SwapModal: ModalComponent<
  {
    swap: Swap;
  } & ConfirmationModalProps
> = ({ swap, onCompletion, hideModal, setDismissible }) => {
  const mutation = useSwap();
  return (
    <ConfirmationModal.Base
      mutation={mutation}
      setDismissible={setDismissible}
      mutationInput={swap}
      title={Localization.Swap.Label.SWAP_TOKENS}
      hideModal={hideModal}
      onCompletion={onCompletion}
      confirm={<SwapDetails swap={swap} />}
      confirming={({ input: swap }) => (
        <ConfirmationModal.Body
          title={Localization.Message.WAITING_FOR_CONFIRMATION}
          className="text-center"
        >
          <div className="flex flex-col gap-1.5">
            <h5 className="text-base md:text-lg">
              {Localization.Label.SUPPLYING}{' '}
              <span className="text-cyan font-medium">
                {toggleAmount(swap.tokenIn.amount, swap.tokenIn.token, { symbol: true })}
              </span>
            </h5>
            <p>{Localization.Message.CONFIRM_TRANSACTION_IN_WALLET}</p>
          </div>
        </ConfirmationModal.Body>
      )}
      processing={({ input: swap, result }) => (
        <ConfirmationModal.Body title={Localization.Swap.Label.SWAPPING_TOKENS}>
          <SwapDetails swap={swap} result={result} />
        </ConfirmationModal.Body>
      )}
      success={({ input: swap, receipt }) => (
        <ConfirmationModal.Body title={Localization.Swap.Label.SWAP_SUCCESSFUL}>
          <SwapDetails swap={swap} receipt={receipt} />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={Localization.Swap.Label.SWAP_FAILED}
    />
  );
};

const SwapDetails: FunctionComponent<{
  swap: Swap;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
}> = ({ swap, result, receipt }) => {
  const { tokenIn, tokenOut } = swap;
  const estimate = useSwapGasEstimate(swap, !result && !receipt);

  return (
    <>
      <ModalBodyGroup title={Localization.Swap.Label.SWAPPING_FROM}>
        <Token.AmountBox token={tokenIn.token} amount={tokenIn.amount} amountFiat />
      </ModalBodyGroup>
      <ModalBodyGroup title={Localization.Swap.Label.SWAPPING_TO}>
        <Token.AmountBox token={tokenOut.token} amount={tokenOut.amount} amountFiat />
      </ModalBodyGroup>
      <ModalBodyGroup>
        {swap && (
          <>
            <FormTitle
              lightTitle
              size="small"
              title={Localization.Swap.Label.RATE}
              value={`1 ${swap.tokenIn.token.symbol} = ${deriveTradeExchangeRates(swap)} ${
                swap.tokenOut.token.symbol
              }`}
            />
            <FormTitle
              lightTitle
              size="small"
              title={Localization.Label.SLIPPAGE_TOLERANCE}
              titleTooltip={Localization.Tooltip.SLIPPAGE_TOLERANCE}
              value={`${basisPointToPercent(swap.slippage)}%`}
            />
          </>
        )}
        <GasEstimate estimate={estimate} receipt={receipt} result={result} />
      </ModalBodyGroup>
    </>
  );
};

export default SwapModal;
