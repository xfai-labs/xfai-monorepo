import { INFT } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';

type Stake = {
  amount: BigNumber;
  slippage: BigNumber;
  minShares: BigNumber;
  totalShares: BigNumber;
  inft?: INFT;
};

export default Stake;
