import { BigNumber } from 'ethers';
import useBackendQuery from '../../meta/useBackendQuery';

type APIResponse = {
  [key: string]: {
    value: string;
    ethValue: string;
    fiatValue: BigNumber;
  };
};
type INFTCollectedTokenFees = {
  [key: string]: {
    value: BigNumber;
    fiatValue: BigNumber;
    ethValue: BigNumber;
  };
};

export const useINFTFees = (period: 'day' | 'week' = 'day') => {
  return useBackendQuery<APIResponse, INFTCollectedTokenFees>(
    ['inftFees', period],
    () => ({
      url: '/inftfees',
      params: {
        period,
      },
    }),
    {
      select: ({ data }) =>
        Object.fromEntries(
          Object.entries(data).map(([address, { value, ethValue, fiatValue }]) => [
            address,
            {
              value: BigNumber.from(value),
              ethValue: BigNumber.from(ethValue),
              fiatValue: BigNumber.from(fiatValue),
            },
          ]),
        ),
      staleTime: 1000 * 60 * 5,
      refetchOnMount: false,
      retry: false,
    },
  );
};
