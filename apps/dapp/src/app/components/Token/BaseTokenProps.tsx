import { TokenInfo } from '@uniswap/token-lists';
import { BigNumber } from 'ethers';

type BaseTokenProps = {
  token?: TokenInfo;
  amount?: BigNumber;
  amountFiat?: true;
  loading?: boolean;
};

export default BaseTokenProps;
