import ConfirmationModal, {
  ConfirmationModalProps,
} from '@dapp/components/Shared/ConfirmationModal';
import Localization from '@dapp/localization';
import { InfoBox, ModalComponent, ModalBodyGroup, TabStake } from '@xfai-labs/ui-components';
import Stake from '@dapp/types/Stake';
import { INFT } from '@xfai-labs/sdk';
import { useStake, useStakeGasEstimate } from '@dapp/hooks/stake/useStake';
import Token from '@dapp/components/Token';
import { toggleAmount } from '@dapp/utils/formatting';
import INFTThumbnail from '@dapp/components/NFTs/Thumbnail';
import AppCardDetail from '@dapp/components/Shared/PageLayout/AppCardDetail';
import { FC } from 'react';
import { GasEstimate } from '@dapp/components/GasEstimate';
import { ContractTransaction, ContractReceipt } from 'ethers';
import { useXfai } from '@dapp/context/XfaiProvider';

type Props = {
  stake: Stake;
  apr?: string;
} & ConfirmationModalProps;

const StakeModal: ModalComponent<Props> = ({
  apr,
  stake,
  onCompletion,
  hideModal,
  setDismissible,
}) => {
  const mutation = useStake();
  const inft = stake.inft;

  return (
    <ConfirmationModal.Base
      setDismissible={setDismissible}
      mutation={mutation}
      mutationInput={stake}
      title={
        !inft
          ? Localization.InfinityStake.Label.INFINITY_STAKING
          : Localization.Boost.Label.BOOST_INFT
      }
      hideModal={hideModal}
      onCompletion={onCompletion}
      confirm={
        <>
          <InfoBox>{Localization.InfinityStake.Message.AMOUNT_WILL_BE_PERMANENTLY_LOCKED}</InfoBox>
          <StakeDetails stake={stake} apr={apr} inft={inft} />
        </>
      }
      confirming={({ input: stake }) => (
        <ConfirmationModal.Body
          title={Localization.Message.WAITING_FOR_CONFIRMATION}
          className="text-center"
        >
          <div className="flex flex-col gap-1.5">
            <h5 className="text-base md:text-lg">
              {Localization.Label.SUPPLYING}{' '}
              <span className="text-cyan font-medium">
                {toggleAmount(stake.amount, 'xfit', { symbol: true })}
              </span>
            </h5>
            <p>{Localization.Message.CONFIRM_TRANSACTION_IN_WALLET}</p>
          </div>
        </ConfirmationModal.Body>
      )}
      processing={({ input: stake, result }) => (
        <ConfirmationModal.Body
          title={
            !inft
              ? Localization.InfinityStake.Label.STAKING
              : Localization.Boost.Label.BOOSTING_INFT
          }
        >
          <StakeDetails stake={stake} apr={apr} inft={inft} result={result} />
        </ConfirmationModal.Body>
      )}
      success={({ input: stake, receipt }) => (
        <ConfirmationModal.Body
          title={
            !inft
              ? Localization.InfinityStake.Label.INFINITY_STAKE_SUCCESSFUL
              : Localization.Boost.Label.INFT_BOOST_SUCCESSFUL
          }
        >
          <StakeDetails stake={stake} apr={apr} inft={inft} receipt={receipt} />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={
        !inft
          ? Localization.InfinityStake.Label.STAKE_FAILED
          : Localization.Boost.Label.INFT_BOOST_FAILED
      }
    />
  );
};

type StakeDetailsProps = {
  stake: Stake;
  apr?: string;
  inft?: INFT;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
};

const StakeDetails: FC<StakeDetailsProps> = ({ apr, stake, inft, receipt, result }) => {
  const xfai = useXfai();
  const estimate = useStakeGasEstimate(stake);
  return (
    <>
      <ModalBodyGroup>
        {inft && <INFTThumbnail.Modal inft={inft} size="medium" />}
        <Token.AmountBox token={xfai.underlyingToken} amount={stake.amount} />
        <AppCardDetail
          icon={TabStake}
          label={Localization.InfinityStake.Label.ESTIMATED_APR}
          value={`${apr}%`}
          tooltip={Localization.InfinityStake.Tooltip.ESTIMATED_APR}
        />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <GasEstimate estimate={estimate} receipt={receipt} result={result} />
      </ModalBodyGroup>
    </>
  );
};

export default StakeModal;
