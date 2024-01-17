import ConfirmationModal, {
  ConfirmationModalProps,
} from '@dapp/components/Shared/ConfirmationModal';
import Localization from '@dapp/localization';
import { FormTitle, ModalBodyGroup, ModalComponent } from '@xfai-labs/ui-components';
import {
  useLiquidityAdd,
  AddLiquidity,
  useLiquidityAddGasEstimate,
} from '@dapp/hooks/liquidity/useLiquidityAdd';
import Token from '@dapp/components/Token';
import { toggleAmount } from '@dapp/utils/formatting';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { GasEstimate } from '@dapp/components/GasEstimate';
import { useXfai } from '@dapp/context/XfaiProvider';

type Props = {
  addLiquidity: AddLiquidity;
} & ConfirmationModalProps;

const LiquidityAddModal: ModalComponent<Props> = ({
  addLiquidity,
  onCompletion,
  hideModal,
  setDismissible,
}) => {
  const mutation = useLiquidityAdd();
  return (
    <ConfirmationModal.Base
      mutation={mutation}
      setDismissible={setDismissible}
      mutationInput={addLiquidity}
      title={Localization.Liquidity.Add.Label.ADD_LIQUIDITY}
      hideModal={hideModal}
      onCompletion={onCompletion}
      confirm={<LiquidityDetails addLiquidity={addLiquidity} />}
      confirming={({ input: addLiquidity }) => (
        <ConfirmationModal.Body
          title={Localization.Message.WAITING_FOR_CONFIRMATION}
          className="text-center"
        >
          <div className="flex flex-col gap-1.5">
            <h5 className="text-base font-light md:text-lg">
              {Localization.Label.SUPPLYING}{' '}
              {addLiquidity && (
                <>
                  <span className="text-cyan font-medium">
                    {toggleAmount(addLiquidity.target.amount, addLiquidity.target.token, {
                      symbol: true,
                    })}
                  </span>
                  {` and `}
                </>
              )}
              <span className="text-cyan font-medium">
                {toggleAmount(addLiquidity.ethAmount, 'eth', {
                  symbol: true,
                })}
              </span>
            </h5>
            <p>{Localization.Message.CONFIRM_TRANSACTION_IN_WALLET}</p>
          </div>
        </ConfirmationModal.Body>
      )}
      processing={({ input: addLiquidity, result }) => (
        <ConfirmationModal.Body title={Localization.Liquidity.Add.Label.ADDING_LIQUIDITY}>
          <LiquidityDetails addLiquidity={addLiquidity} result={result} />
        </ConfirmationModal.Body>
      )}
      success={({ input: addLiquidity, receipt }) => (
        <ConfirmationModal.Body title={Localization.Liquidity.Add.Label.LIQUIDITY_ADDED}>
          <LiquidityDetails addLiquidity={addLiquidity} receipt={receipt} />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={Localization.Liquidity.Add.Label.ADD_LIQUIDITY_FAILED}
    />
  );
};

const LiquidityDetails = ({
  addLiquidity,
  receipt,
  result,
}: {
  addLiquidity: AddLiquidity;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
}) => {
  const xfai = useXfai();
  const { target, ethAmount } = addLiquidity;
  const estimate = useLiquidityAddGasEstimate(addLiquidity);
  return (
    <>
      {target && (
        <ModalBodyGroup title={Localization.Liquidity.Add.Label.PRIMARY_TOKEN_AND_AMOUNT}>
          <Token.AmountBox token={target.token} amount={target.amount} amountFiat />
        </ModalBodyGroup>
      )}
      <ModalBodyGroup title={Localization.Liquidity.Add.Label.SECONDARY_TOKEN_AND_AMOUNT}>
        <Token.AmountBox token={xfai.nativeToken} amount={ethAmount} amountFiat />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <FormTitle
          lightTitle
          size="small"
          title={Localization.Liquidity.Label.POOL_SHARE}
          titleTooltip={Localization.Liquidity.Add.Tooltip.POOL_SHARE}
          value={`${addLiquidity.poolShare}%`}
        />
        <GasEstimate estimate={estimate} receipt={receipt} result={result} />
      </ModalBodyGroup>
    </>
  );
};

export default LiquidityAddModal;
