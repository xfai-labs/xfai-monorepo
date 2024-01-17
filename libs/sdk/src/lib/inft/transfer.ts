import { AccountAddress, Xfai } from '../xfai';
import { getINFT, INFT } from './core';
import { PopulatedTransaction } from 'ethers';
export async function transfer(
  xfai: Xfai,
  inft: INFT,
  newOwner: AccountAddress,
): Promise<PopulatedTransaction> {
  const inftContract = getINFT(xfai);
  const signer = await xfai.provider.getSigner();
  const signerAddress = await signer.getAddress();
  return inftContract.populateTransaction.transferFrom(signerAddress, newOwner.address, inft.id, {
    from: signerAddress,
  });
}
