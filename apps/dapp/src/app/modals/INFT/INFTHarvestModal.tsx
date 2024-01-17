import { useState, useEffect, FC, Dispatch, SetStateAction, useMemo } from 'react';
import ConfirmationModal from '@dapp/components/Shared/ConfirmationModal';
import Localization from '@dapp/localization';
import INFTThumbnail from '@dapp/components/NFTs/Thumbnail';
import {
  FormTitle,
  ModalBodyGroup,
  ModalComponent,
  Slider,
  IconCheckMark,
  InlineLink,
  TabINFT,
  InfoBox,
} from '@xfai-labs/ui-components';
import { TokenInfo } from '@uniswap/token-lists';
import Token from '@dapp/components/Token';
import { INFT } from '@xfai-labs/sdk';
import useINFTHarvest, {
  INFTHarvest,
  useINFTHarvestGasEstimate,
} from '@dapp/hooks/inft/useINFTHarvest';
import { useINFTTokenBalance } from '@dapp/hooks/inft/useINFTTokenBalance';
import { toggleAmount } from '@dapp/utils/formatting';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { GasEstimate } from '@dapp/components/GasEstimate';
import * as Checkbox from '@radix-ui/react-checkbox';
import cs from 'classnames';
import MainConfig from '@dapp/config/MainConfig';
import AmountBox from '@dapp/components/Shared/AmountBox';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import { UseWeb3EstimateResult } from '@dapp/hooks/meta/useWeb3Estimate';

const INFTHarvestModal: ModalComponent<{
  inft: INFT;
  token: TokenInfo;
}> = ({ inft, token, hideModal, setDismissible }) => {
  const [harvest, setHarvest] = useState<INFTHarvest>();
  const mutation = useINFTHarvest();
  const estimate = useINFTHarvestGasEstimate(inft, token);
  const [checked, setChecked] = useState<Checkbox.CheckedState>(false);

  return (
    <ConfirmationModal.Base
      mutation={mutation}
      setDismissible={setDismissible}
      mutationInput={harvest}
      title={`${Localization.INFTs.Label.HARVEST} ${token.symbol} ${Localization.INFTs.Label.FEES}`}
      confirmLabel={Localization.INFTs.Button.PROCEED}
      hideModal={hideModal}
      confirm={
        <>
          <ModalBodyGroup>
            <InfoBox className="!gap-2 !p-2 !pl-3" iconColor="fill-red">
              {Localization.INFTs.Message.HARVESTING_REDUCES_POOL_SHARE}
            </InfoBox>
            <div className="bg-60 flex items-center gap-2 rounded-lg p-2">
              <Checkbox.Root
                checked={checked}
                onCheckedChange={setChecked}
                className={cs(
                  'bg-40 border-white-black/5 block h-6 w-6 rounded-md border p-1 lg:h-5 lg:w-5',
                  checked && 'bg-cyan',
                )}
                id="harvestCheck"
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <IconCheckMark className="fill-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label className="pt-0.5 text-sm" htmlFor="harvestCheck">
                {`${Localization.INFTs.Label.I_HAVE_READ_THE} `}
                <InlineLink href={MainConfig.INFTS_HARVEST_DOCUMENTATION_URL} target="_blank">
                  {Localization.INFTs.Button.INFT_HARVEST_GUIDE}
                </InlineLink>
              </label>
            </div>
          </ModalBodyGroup>
          <INFTHarvestConfirmModal
            className={!checked ? 'pointer-events-none opacity-30 grayscale' : ''}
            agreement={!!checked}
            setHarvest={setHarvest}
            inft={inft}
            token={token}
            estimate={estimate}
          />
        </>
      }
      confirming={({ input: harvest }) => (
        <ConfirmationModal.Body
          title={Localization.Message.WAITING_FOR_CONFIRMATION}
          className="text-center"
        >
          <div className="flex flex-col gap-1.5">
            <h5 className="text-base font-light md:text-lg">
              {Localization.INFTs.Label.HARVESTING}
              <span className="text-cyan font-medium">
                {' '}
                {toggleAmount(harvest.amount, harvest.token, { symbol: true })}
              </span>
            </h5>
            <p>{Localization.Message.CONFIRM_TRANSACTION_IN_WALLET}</p>
          </div>
        </ConfirmationModal.Body>
      )}
      processing={({ input: harvest, result }) => (
        <ConfirmationModal.Body
          title={`${Localization.INFTs.Label.HARVESTING} ${token.symbol} ${Localization.INFTs.Label.FEES}`}
        >
          <INFTHarvestDetails
            inft={inft}
            token={token}
            harvest={harvest}
            result={result}
            estimate={estimate}
          />
        </ConfirmationModal.Body>
      )}
      success={({ input: harvest, receipt }) => (
        <ConfirmationModal.Body
          title={`${token.symbol} ${Localization.INFTs.Label.HARVEST} ${Localization.Label.SUCCESSFUL}`}
        >
          <INFTHarvestDetails
            inft={inft}
            token={token}
            harvest={harvest}
            receipt={receipt}
            estimate={estimate}
          />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={`${token.symbol} ${Localization.INFTs.Label.HARVEST} ${Localization.Label.FAILED}`}
    />
  );
};

const INFTHarvestConfirmModal: FC<{
  inft: INFT;
  token: TokenInfo;
  agreement: boolean;
  setHarvest: Dispatch<SetStateAction<INFTHarvest | undefined>>;
  estimate: UseWeb3EstimateResult;
  className?: string;
}> = ({ agreement, setHarvest, inft, token, estimate, className }) => {
  const { data: balance, isLoading } = useINFTTokenBalance(inft, token);
  const [inputType, setInputType] = useState<'percent' | 'amount'>('percent');

  const [harvestPercent, setHarvestPercent] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>();
  const fiat = useFiatValue(token);

  const [error, setError] = useState<string>();

  const amountOut = useMemo(() => {
    if (!balance) return undefined;
    if (inputType === 'percent') {
      const input = balance?.amount?.mul(harvestPercent).div(100);
      setAmountInput(toggleAmount(input, token));
      return input;
    } else {
      if (!amountInput) return;
      setHarvestPercent(
        Math.min(
          toggleAmount(amountInput, token).mul(10000).div(balance.amount).toNumber() / 100,
          100,
        ),
      );
      return toggleAmount(amountInput, token);
    }
  }, [amountInput, balance, harvestPercent, inputType, token]);

  useEffect(() => {
    setError(undefined);
    setHarvest(undefined);

    if (!balance || !amountOut) {
      return;
    }
    if (amountOut.gt(balance.amount)) {
      setError('Insuffucient balance');
      return;
    }

    if (amountOut.isZero()) {
      return;
    }

    setHarvest({
      token,
      inft,
      amount: amountOut,
    });
  }, [amountOut, inft, setHarvest, token, harvestPercent, balance]);

  useEffect(() => {
    if (!agreement) {
      setHarvestPercent(0);
    }
  }, [agreement]);

  return (
    <>
      <ModalBodyGroup className={className}>
        <INFTThumbnail.Modal inft={inft} size="medium" />
      </ModalBodyGroup>
      <ModalBodyGroup className={className}>
        <FormTitle
          title={Localization.INFTs.Label.HARVEST_AMOUNT}
          titleTooltip={Localization.INFTs.Tooltip.HARVEST_AMOUNT}
          size="small"
          value={`${harvestPercent}%`}
        />
        <Slider
          step={1}
          disabled={isLoading}
          value={[harvestPercent]}
          onValueChange={(value) => {
            setHarvestPercent(value[0]);
            setInputType('percent');
          }}
        />
      </ModalBodyGroup>
      <ModalBodyGroup className={className}>
        <AmountBox
          tokenSelect={false}
          tokenSelectProps={{
            token: token,
          }}
          error={error}
          errorType={'error'}
          tokenAmount={amountInput}
          fiatValue={fiat(amountInput)}
          setTokenAmount={(amount) => {
            setAmountInput(amount);
            setInputType('amount');
          }}
          balance={balance?.amount}
          maxOnClick={() => {
            setHarvestPercent(100);
            setInputType('percent');
          }}
          walletIcon={TabINFT}
        />
      </ModalBodyGroup>
      <ModalBodyGroup className={className}>
        <GasEstimate estimate={estimate} />
      </ModalBodyGroup>
    </>
  );
};

const INFTHarvestDetails: FC<{
  inft: INFT;
  token: TokenInfo;
  harvest: INFTHarvest;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
  estimate: UseWeb3EstimateResult;
}> = ({ inft, token, harvest, receipt, result, estimate }) => {
  return (
    <>
      <ModalBodyGroup>
        <INFTThumbnail.Modal inft={inft} />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <Token.AmountBox token={token} amount={harvest.amount} />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <GasEstimate estimate={estimate} receipt={receipt} result={result} />
      </ModalBodyGroup>
    </>
  );
};

export default INFTHarvestModal;
