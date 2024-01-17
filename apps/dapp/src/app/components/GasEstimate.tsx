import { useXfai } from '@dapp/context/XfaiProvider';
import { UseWeb3EstimateResult } from '@dapp/hooks/meta/useWeb3Estimate';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import Localization from '@dapp/localization';
import { toggleAmount } from '@dapp/utils/formatting';
import { getTransactionGasCost } from '@xfai-labs/sdk';
import { FormTitle } from '@xfai-labs/ui-components';
import { ContractTransaction, ContractReceipt } from 'ethers';

export const GasEstimate = ({
  estimate,
  result,
  receipt,
}: {
  estimate: UseWeb3EstimateResult;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
}) => {
  const { data, isSuccess, isLoading, isRefetching, isError } = estimate;
  const xfai = useXfai();
  const fiatValue = useFiatValue(xfai.nativeToken);

  const gas = () => {
    if (receipt) {
      return toggleAmount(fiatValue(getTransactionGasCost(receipt)), 'fiat', {
        prefix: '$',
      });
    }

    if (result) {
      return toggleAmount(
        fiatValue(getTransactionGasCost(result) ?? data?.estimatedFee ?? data?.maxFee),
        'fiat',
        {
          prefix: '$',
        },
      );
    }

    if (isError) {
      return undefined;
    }

    if (isSuccess) {
      return `${toggleAmount(fiatValue(data.estimatedFee), 'fiat', {
        prefix: '~$',
      })}`;
    }
  };

  const maxGas = () => {
    return isSuccess ? toggleAmount(fiatValue(data.maxFee), 'fiat', { prefix: '$' }) : undefined;
  };

  return (
    <FormTitle
      lightTitle
      size="small"
      title={Localization.Label.GAS_FEE}
      titleTooltip={Localization.Tooltip.GAS_FEE}
      value={gas()}
      valueTooltip={`${Localization.Label.MAX_GAS} ${maxGas()}`}
      valueIsLoading={(!gas() && !maxGas()) || isLoading}
      valueIsRefreshing={isRefetching}
    />
  );
};
