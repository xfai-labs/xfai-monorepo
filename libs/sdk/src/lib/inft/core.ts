import { IXfaiINFT__factory } from '@xfai-labs/dex';
import { BigNumber, CallOverrides } from 'ethers';
import { Xfai } from '../xfai';

export type INFT = {
  id: number;
  type: 'inft_id';
};

export const INFT = (id: number): INFT => ({
  type: 'inft_id',
  id,
});

const INFT_SPECIAL_IMAGE_IDS = [42, 53, 56, 355, 367, 190, 209, 57, 150] as const;

export const getInftImage = (inft: INFT, quality?: undefined | 'md' | 'sm' | 'lg') =>
  `https://nftassets.xfai.com/${quality ? `${quality}-` : ''}${
    INFT_SPECIAL_IMAGE_IDS.includes(inft.id as (typeof INFT_SPECIAL_IMAGE_IDS)[number])
      ? inft.id
      : '0'
  }.webp`;

const SHARE_UNIT = BigNumber.from(10).pow(18);

export type INFTState = {
  reserve: BigNumber;
  initialReserve: BigNumber;
  shares: BigNumber;
};

export function getINFT(xfai: Xfai, signer = false) {
  return IXfaiINFT__factory.connect(
    xfai.inftAddress,
    signer ? xfai.provider.getSigner() : xfai.provider,
  );
}

export async function getINFTOwnership(
  xfai: Xfai,
  inft: INFT,
): Promise<{
  owner: string;
}> {
  const owner = await getINFT(xfai).ownerOf(inft.id);

  return { owner: owner.toLowerCase() };
}

export async function getINFTState(xfai: Xfai, options: CallOverrides): Promise<INFTState> {
  const [initialReserve, reserve, shares] = await getINFT(xfai).getStates(options);

  return {
    initialReserve,
    reserve,
    shares,
  };
}

export const calculateShare = (inftState: INFTState, input: BigNumber): BigNumber => {
  if (input.isZero()) {
    return BigNumber.from(0);
  }
  return input.mul(SHARE_UNIT).div(inftState.reserve.add(inftState.initialReserve).add(input));
};
