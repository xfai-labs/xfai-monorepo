import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { delayMs, isParsedEthersError, ParsedEthersError, Xfai } from '@xfai-labs/sdk';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { useEffect, useState } from 'react';
import useChain from '../chain/useChain';
import { useXfai } from '@dapp/context/XfaiProvider';
import { captureException } from '@sentry/react';
import { EthersError, getParsedEthersError } from '@enzoferey/ethers-error-parser';

const GANACHE_NETWORK_ID = 5777;

export type UseWeb3MutationStatus = 'idle' | 'error' | 'confirming' | 'processing' | 'success';

export type UseWeb3MutationResult<O> = Omit<
  UseMutationResult<ContractTransaction, ParsedEthersError | Error, O>,
  'status'
> & {
  status: UseWeb3MutationStatus;
  isConfirming: boolean;
  receipt: undefined | ContractReceipt;
};

const useWeb3Mutation = <O>(
  mutationFn: (xfai: Xfai, variables: O) => Promise<ContractTransaction>,
  {
    onSuccess,
    onError,
    ...options
  }: UseMutationOptions<ContractTransaction, unknown, undefined | O> = {},
): UseWeb3MutationResult<O> => {
  const chain = useChain();
  const xfai = useXfai();
  const [confirmingError, setConfirmingError] = useState<ParsedEthersError | Error>();
  const [receipt, setReceipt] = useState<ContractReceipt>();
  const mutationResult = useMutation<ContractTransaction, ParsedEthersError | Error, O>({
    mutationFn: (variables: O) => mutationFn(xfai, variables),
    ...options,
    onError: (error, variables, context) => {
      if (isParsedEthersError(error)) {
        if (error.context.errorCode !== 'REJECTED_TRANSACTION') {
          captureException(error.error, {
            extra: error.context,
            tags: {
              stage: 'mempool',
            },
          });
        }
      } else {
        captureException(error, {
          tags: {
            stage: 'confirming',
          },
        });
      }
      if (onError) onError(error, variables, context);
    },
  });

  useEffect(() => {
    if (mutationResult.data === undefined) {
      setReceipt(undefined);
      return;
    }

    if (mutationResult.data && receipt === undefined) {
      (async () => {
        // we introduce an artificial delay so the user sees the "confirming" state at least for a few seconds
        try {
          const [tx] = await Promise.all([
            mutationResult.data.wait(chain?.chainId === GANACHE_NETWORK_ID ? 0 : 1),
            delayMs(2 * 1000),
          ]);
          setReceipt(tx);
          if (onSuccess) onSuccess(mutationResult.data, mutationResult.variables, tx);
        } catch (error) {
          try {
            const parsedEthersError = getParsedEthersError(error as EthersError);
            captureException(error, {
              extra: parsedEthersError,
              tags: {
                stage: 'confirming',
              },
            });
          } catch (e) {
            captureException(error, {
              tags: {
                stage: 'confirming',
              },
            });
          }
          setConfirmingError(error as Error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationResult.data, onSuccess, mutationResult.variables]);

  const isError = mutationResult.isError || !!confirmingError;

  return {
    ...mutationResult,
    status: (isError
      ? 'error'
      : mutationResult.status === 'success'
      ? receipt
        ? 'success'
        : 'processing'
      : mutationResult.status === 'loading'
      ? 'confirming'
      : mutationResult.status) as UseWeb3MutationStatus,
    receipt,
    error: confirmingError || mutationResult.error,
    isConfirming: mutationResult.status === 'success' && !receipt,
    isSuccess: !!receipt,
  };
};

export default useWeb3Mutation;
