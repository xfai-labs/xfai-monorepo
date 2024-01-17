import { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { Xfai } from '@xfai-labs/sdk';
import { BigNumber, PopulatedTransaction } from 'ethers';
import useXfaiQuery from './useXfaiQuery';

type EstimationResult = {
  maxFee: BigNumber;
  estimatedFee: BigNumber;
};

export type UseWeb3EstimateResult = UseQueryResult<EstimationResult, Error>;

const useGasPrice = () =>
  useXfaiQuery(['gasPrice'], (xfai) => xfai.provider.getFeeData(), {
    staleTime: 10 * 1000, // 10 sec
    refetchInterval: 30 * 1000, // 30 sec
  });

const useWeb3Estimate = (
  keys: QueryKey,
  gasOrPopulatedTx: (xfai: Xfai) => number | PopulatedTransaction | Promise<PopulatedTransaction>,
  options: UseQueryOptions<EstimationResult, Error> = {},
) => {
  const { data: gasPrice, isSuccess, isRefetching } = useGasPrice();
  const data = useXfaiQuery<EstimationResult, Error>(
    [...keys, gasPrice?.gasPrice?.toString() ?? '0'],
    async (xfai) => {
      const gasOrPop = await gasOrPopulatedTx(xfai);
      const gas =
        typeof gasOrPop === 'number'
          ? BigNumber.from(gasOrPop)
          : await xfai.provider.estimateGas(gasOrPop);

      return {
        maxFee: gasPrice!.maxFeePerGas?.mul(gas) ?? BigNumber.from(0),
        estimatedFee:
          gasPrice!.lastBaseFeePerGas?.add(gasPrice!.maxPriorityFeePerGas ?? 0).mul(gas) ??
          BigNumber.from(0),
      };
    },
    {
      ...options,
      enabled: isSuccess && options.enabled,
    },
  ) as UseWeb3EstimateResult;
  return {
    ...data,
    isRefetching: data.isRefetching || isRefetching,
  };
};

export default useWeb3Estimate;
