import { BigNumber } from 'ethers';
import useBackendQuery from '../../meta/useBackendQuery';
import { INFT } from '@xfai-labs/sdk';

type APIResponse = {
  [key: string]: {
    fiatValue: string;
    ethValue: string;
  };
};
type INFTCollectedEstimatedValue = {
  [key: string]: {
    fiatValue: BigNumber;
    ethValue: BigNumber;
  };
};

export const useInftDetails = (inft: INFT) => {
  return useBackendQuery<APIResponse, INFTCollectedEstimatedValue>(
    ['inftdetails', inft?.id],
    () => ({
      url: '/inftdetails',
      params: {
        inftId: inft.id,
      },
    }),
    {
      select: ({ data }) =>
        Object.fromEntries(
          Object.entries(data).map(([address, { fiatValue, ethValue }]) => [
            address,
            {
              fiatValue: BigNumber.from(fiatValue),
              ethValue: BigNumber.from(ethValue),
            },
          ]),
        ),
      staleTime: 1000 * 60 * 5,
      refetchOnMount: false,
    },
  );
};
