import { TokenInfo } from '@uniswap/token-lists';
import { TradeType } from '@xfai-labs/sdk';
import { BigNumber } from 'ethers';

type Swap = {
  wethSwap: boolean;
  type: TradeType;
  tokenIn: {
    token: TokenInfo;
    amount: BigNumber;
  };
  tokenOut: {
    token: TokenInfo;
    amount: BigNumber;
  };
  slippage: BigNumber;
};

export default Swap;
