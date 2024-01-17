import { Xfai } from '../xfai';
import { BigNumber, BigNumberish, Signer } from 'ethers';
import { IInfinityNFTPeriphery__factory, IXfaiV0Periphery03__factory } from '@xfai-labs/dex';
export const getPeriphery = (xfai: Xfai, signer: Signer) => {
  return IXfaiV0Periphery03__factory.connect(xfai.peripheryAddress, signer);
};

export const getINFTPeriphery = (xfai: Xfai, signer: Signer) => {
  return IInfinityNFTPeriphery__factory.connect(xfai.inftPeripheryAddress, signer);
};

export type TransactionOptions = {
  deadline: Date;
  from: Signer;
  to?: Signer | string;
  gasLimit?: BigNumber;
  slippage: BigNumberish;
};

export const deriveToAddress = async ({
  to,
  from,
}: Pick<TransactionOptions, 'from' | 'to'>): Promise<string> => {
  if (to) {
    return to instanceof Signer ? to.getAddress() : to;
  }

  return from.getAddress();
};
