import { useXfai } from '@dapp/context/XfaiProvider';
import { UseWeb3EstimateResult } from '@dapp/hooks/meta/useWeb3Estimate';
import useFiatValue from '@dapp/hooks/tokens/useFiatValue';
import Localization from '@dapp/localization';
import { toggleAmount } from '@dapp/utils/formatting';
import { getTransactionGasCost } from '@xfai-labs/sdk';
import { IconGas, SkeletonWrapper, Tooltip } from '@xfai-labs/ui-components';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { FunctionComponent } from 'react';

type Props = {
  estimate: UseWeb3EstimateResult;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
};

const Gas: FunctionComponent<Props> = ({ estimate, result, receipt }) => {
  const xfai = useXfai();
  const { data, isSuccess, isLoading, isRefetching, isError } = estimate;
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
      return Localization.Label.COULD_NOT_ESTIMATE;
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
    <Tooltip placement="bottom" text={`${Localization.Label.MAX_GAS} ${maxGas()}`}>
      <div className="text-10 text-xsm flex items-center gap-1.5 leading-none">
        <IconGas className="fill-10 h-3.5 w-3.5" />
        {gas() ? <span>{gas()}</span> : <SkeletonWrapper>Loading</SkeletonWrapper>}
      </div>
    </Tooltip>
  );
};

export default Gas;
