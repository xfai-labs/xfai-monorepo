import { TokenInfo } from '@uniswap/token-lists';
import { harvestINFT, INFT, sendPopulatedTx, Token } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';
import useWeb3Estimate from '../meta/useWeb3Estimate';
import useWeb3Mutation from '../meta/useWeb3Mutation';
import { useQueryClient } from '@tanstack/react-query';

export type INFTHarvest = {
  inft: INFT;
  amount: BigNumber;
  token: TokenInfo;
};

const useINFTHarvest = () => {
  const queryClient = useQueryClient();
  return useWeb3Mutation(
    async (xfai, { inft, token, amount }: INFTHarvest) =>
      sendPopulatedTx(xfai, harvestINFT(xfai, inft, token, amount)),
    {
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries(['inftAccumulatedBalance']),
          queryClient.invalidateQueries(['inftBalance']),
        ]),
    },
  );
};

export const useINFTHarvestGasEstimate = (inft: INFT, token: Token) =>
  useWeb3Estimate(['estimateHarvest'], (xfai) => harvestINFT(xfai, inft, token, BigNumber.from(1)));

export default useINFTHarvest;
