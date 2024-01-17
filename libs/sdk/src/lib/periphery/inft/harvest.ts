import { BigNumber, PopulatedTransaction } from 'ethers';
import { Xfai } from '../../xfai';
import { isNativeToken, Token } from '../../xfai-token';
import { getINFT, INFT } from '../../inft';

export const harvestINFT = (
  xfai: Xfai,
  inft: INFT,
  token: Token,
  amountOut: BigNumber,
): Promise<PopulatedTransaction> => {
  if (isNativeToken(token)) {
    return harvestInftEth(xfai, inft, amountOut);
  }
  return harvestInftErc20(xfai, inft, token, amountOut);
};

export const harvestInftEth = async (xfai: Xfai, inft: INFT, amountOut: BigNumber) =>
  getINFT(xfai, true).populateTransaction.harvestETH(inft.id, amountOut, {
    from: await xfai.provider.getSigner().getAddress(),
  });

export const harvestInftErc20 = async (
  xfai: Xfai,
  inft: INFT,
  token: Token,
  amountOut: BigNumber,
) =>
  getINFT(xfai, true).populateTransaction.harvestToken(
    token.address,

    inft.id,
    amountOut,
    {
      from: await xfai.provider.getSigner().getAddress(),
    },
  );
