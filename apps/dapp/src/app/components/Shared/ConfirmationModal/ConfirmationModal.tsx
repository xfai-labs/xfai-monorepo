/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ModalProcessingImage from './ModalProcessingImage';
import ModalConfirmingImage from './ModalConfirmingImage';
import successBackgroundImageURL from '@dapp/assets/success.png';
import failureBackgroundImageURL from '@dapp/assets/failure.png';

import { Modal, ModalFooterItem } from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import { UseWeb3MutationResult } from '@dapp/hooks/meta/useWeb3Mutation';
import useGetExplorerLink from '@dapp/hooks/chain/useGetExplorerLink';
import { ReactNode, ComponentPropsWithoutRef, useEffect, FC, createElement } from 'react';
import ConfirmationModalBody from './ConfirmationModalBody';
import { isParsedEthersError } from '@xfai-labs/sdk';

type Data<O> = {
  input: NonNullable<O>;
};
type ConfirmationModalProps<O> = {
  mutation: UseWeb3MutationResult<O>;
  mutationInput: O | undefined;
  confirm: ReactNode;
  confirming: FC<Data<O>>;
  processing: FC<Data<O> & { result: UseWeb3MutationResult<O>['data'] }>;
  confirmLabel?: string;
  errorScreenTitle: string;
  success: FC<Data<O> & { receipt: NonNullable<UseWeb3MutationResult<O>['receipt']> }>;
  onCompletion?: (success: boolean) => void;
} & ComponentPropsWithoutRef<Modal>;

function isDismissible<O>(status: UseWeb3MutationResult<O>['status']): boolean {
  return (
    {
      idle: true,
      confirming: false,
      processing: false,
      success: false,
      error: true,
    }[status] ?? true
  );
}

export default function ConfirmationModal<O>({
  title,
  setDismissible,
  hideModal,
  mutation,
  mutationInput,
  confirm,
  confirming,
  processing,
  confirmLabel = Localization.Button.CONFIRM,
  errorScreenTitle,
  success,
  onCompletion,
}: ConfirmationModalProps<O>) {
  const getBlockExplorerLink = useGetExplorerLink();
  const cancelButton: ModalFooterItem = {
    text: Localization.Button.CANCEL,
    onClick: () => hideModal(),
  };
  const confirmButton: ModalFooterItem = {
    text: confirmLabel,
    onClick: mutationInput
      ? () => {
          mutation.mutate(mutationInput);
        }
      : undefined,
  };

  const retryButton: ModalFooterItem = {
    text: 'Retry',
    onClick: mutationInput
      ? () => {
          mutation.mutate(mutationInput);
        }
      : undefined,
  };

  const doneButton: ModalFooterItem = {
    text: Localization.Button.DONE,
    onClick: () => {
      hideModal();
      onCompletion && onCompletion(mutation.status === 'success' ? true : false);
    },
  };

  const detailsButton: ModalFooterItem = {
    text: Localization.Button.DETAILS,
    url: mutation.data?.hash ? getBlockExplorerLink(mutation.data.hash, 'tx') : undefined,
  };

  function getFooterButtons(
    status: UseWeb3MutationResult<O>['status'],
  ): undefined | ModalFooterItem[] {
    switch (status) {
      case 'idle':
        return [cancelButton, confirmButton];
      case 'confirming':
        return undefined;
      case 'processing':
        return undefined;
      case 'error':
        if (isParsedEthersError(mutation.error)) {
          switch (mutation.error.context.errorCode) {
            case 'REJECTED_TRANSACTION':
              return [retryButton, doneButton];
          }
        }
        return [detailsButton, doneButton];
      default:
        return [detailsButton, doneButton];
    }
  }

  useEffect(
    () => setDismissible(isDismissible(mutation.status)),
    [mutation.status, setDismissible],
  );

  function getHeaderImage(status: UseWeb3MutationResult<O>['status']): ReactNode {
    switch (status) {
      case 'confirming':
        return <ModalConfirmingImage />;
      case 'processing':
        return <ModalProcessingImage />;
      case 'success':
        return <img src={successBackgroundImageURL} alt="Transaction Successful" />;
      case 'error':
        return (
          <img
            src={failureBackgroundImageURL}
            alt={
              isParsedEthersError(mutation.error) &&
              mutation.error.context.errorCode === 'REJECTED_TRANSACTION'
                ? Localization.Message.TRANSACTION_REJECTED_BY_USER
                : errorScreenTitle
            }
          />
        );
      default:
        return null;
    }
  }

  function getBottomText(status: UseWeb3MutationResult<O>['status']): string | undefined {
    switch (status) {
      case 'processing':
        return Localization.Message.THIS_MAY_TAKE_SOME_TIME;
      default:
        return undefined;
    }
  }

  const modalProps = {
    hideModal,
    setDismissible,
    canDismiss: false,
    title: mutation.status === 'idle' ? title : undefined,
    header: getHeaderImage(mutation.status) && (
      <div className="flex h-[11rem] items-center justify-center overflow-hidden lg:h-auto">
        {getHeaderImage(mutation.status)}
      </div>
    ),
    footerButtons: getFooterButtons(mutation.status),
    bottomText: getBottomText(mutation.status),
  };
  return (
    <Modal {...modalProps}>
      {mutation.status === 'idle' && confirm}
      {mutation.status === 'confirming' &&
        createElement(confirming, { input: mutation.variables! })}
      {mutation.status === 'processing' &&
        createElement(processing, { input: mutation.variables!, result: mutation.data })}
      {mutation.status === 'success' &&
        createElement(success, { input: mutation.variables!, receipt: mutation.receipt! })}
      {mutation.status === 'error' &&
        !(
          isParsedEthersError(mutation.error) &&
          mutation.error.context.errorCode === 'REJECTED_TRANSACTION'
        ) && (
          <ConfirmationModalBody title={errorScreenTitle} className="text-center">
            {Localization.Message.TRANSACTION_FAILED_CHECK_DETAILS}
          </ConfirmationModalBody>
        )}
      {mutation.status === 'error' &&
        isParsedEthersError(mutation.error) &&
        mutation.error.context.errorCode === 'REJECTED_TRANSACTION' && (
          <ConfirmationModalBody
            title={Localization.Message.TRANSACTION_REJECTED_BY_USER}
            className="text-center"
          />
        )}
    </Modal>
  );
}
