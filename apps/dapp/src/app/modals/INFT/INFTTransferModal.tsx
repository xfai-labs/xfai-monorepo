import { useState, ChangeEvent, FC } from 'react';
import ConfirmationModal from '@dapp/components/Shared/ConfirmationModal';
import Localization from '@dapp/localization';
import INFTThumbnail from '@dapp/components/NFTs/Thumbnail';
import {
  ModalBodyGroup,
  Input,
  InfoBox,
  CopyToClipboard,
  ModalComponent,
} from '@xfai-labs/ui-components';
import { useTransferINFT, useTransferINFTGasEstimate } from '@dapp/hooks/inft/useTransferINFT';
import { INFT } from '@xfai-labs/sdk';
import { ContractReceipt, ContractTransaction, utils } from 'ethers';
import useGetINFTOwnership from '@dapp/hooks/inft/useGetINFTOwnership';
import { GasEstimate } from '@dapp/components/GasEstimate';
import { UseWeb3EstimateResult } from '@dapp/hooks/meta/useWeb3Estimate';

const INFTTransferModal: ModalComponent<{
  inft: INFT;
}> = ({ inft, hideModal, setDismissible }) => {
  const [targetAddress, setTargetAddress] = useState<string>('');
  const { data: ownership } = useGetINFTOwnership(inft);

  const sameAddress = targetAddress.toUpperCase() === ownership?.owner.toUpperCase();
  const validAddress = utils.isAddress(targetAddress.toLowerCase());

  const isError = sameAddress || !validAddress;

  const mutation = useTransferINFT();
  const estimate = useTransferINFTGasEstimate();

  const validationMessage = () => {
    if (targetAddress.length && isError) {
      if (!validAddress) {
        return Localization.INFTs.Label.INCORRECT_FORMAT;
      } else {
        return Localization.INFTs.Label.SAME_OWNER_ERROR;
      }
    } else {
      return undefined;
    }
  };

  return (
    <ConfirmationModal.Base
      mutation={mutation}
      setDismissible={setDismissible}
      mutationInput={
        !isError
          ? {
              inft,
              target: targetAddress,
            }
          : undefined
      }
      title={Localization.INFTs.Label.TRANSFER_INFT}
      hideModal={hideModal}
      confirm={
        <>
          <ModalBodyGroup>
            <InfoBox iconColor="fill-red">{Localization.INFTs.Message.TRANSFER_WARNING}</InfoBox>
          </ModalBodyGroup>
          <ModalBodyGroup>
            <INFTThumbnail.Modal inft={inft} />
          </ModalBodyGroup>
          <ModalBodyGroup title="Wallet Address" required>
            <Input.Base
              name="walletAddress"
              type="text"
              placeholder="0x703d...1628"
              validationMessage={validationMessage()}
              validationType={validationMessage() ? 'error' : undefined}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetAddress(e.target.value)}
            />
          </ModalBodyGroup>
          <ModalBodyGroup>
            <GasEstimate estimate={estimate} />
          </ModalBodyGroup>
        </>
      }
      confirming={({ input: transfer }) => (
        <ConfirmationModal.Body
          title={Localization.INFTs.Label.CONFIRM_INFT_TRANSFER}
          className="text-center"
        >
          <INFTTransferDetails
            inft={transfer.inft}
            walletAddress={transfer.target}
            estimate={estimate}
          />
        </ConfirmationModal.Body>
      )}
      processing={({ input: transfer, result }) => (
        <ConfirmationModal.Body title={Localization.INFTs.Label.TRANSFERRING_INFT}>
          <INFTTransferDetails
            inft={transfer.inft}
            walletAddress={transfer.target}
            result={result}
            estimate={estimate}
          />
        </ConfirmationModal.Body>
      )}
      success={({ input: transfer, receipt }) => (
        <ConfirmationModal.Body title={Localization.INFTs.Label.INFT_TRANSFER_SUCCESSFUL}>
          <INFTTransferDetails
            inft={transfer.inft}
            walletAddress={transfer.target}
            receipt={receipt}
            estimate={estimate}
          />
        </ConfirmationModal.Body>
      )}
      errorScreenTitle={Localization.INFTs.Label.INFT_TRANSFER_FAILED}
    />
  );
};

const INFTTransferDetails: FC<{
  inft: INFT;
  walletAddress: string;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
  estimate?: UseWeb3EstimateResult;
}> = ({ inft, walletAddress, receipt, result, estimate }) => {
  return (
    <>
      <ModalBodyGroup>
        <INFTThumbnail.Modal inft={inft} />
      </ModalBodyGroup>
      <ModalBodyGroup>
        <CopyToClipboard value={walletAddress} />
      </ModalBodyGroup>
      {estimate && (
        <ModalBodyGroup>
          <GasEstimate estimate={estimate} receipt={receipt} result={result} />
        </ModalBodyGroup>
      )}
    </>
  );
};

export default INFTTransferModal;
