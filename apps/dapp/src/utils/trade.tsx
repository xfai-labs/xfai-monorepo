import Swap from '@dapp/types/Swap';
import { BigNumber } from 'ethers';
import { toggleAmount } from './formatting';
import { TokenInfo } from '@uniswap/token-lists';
import { isNativeToken } from '@xfai-labs/sdk';

export const deriveTradeExchangeRates = (trade: Swap) => {
  if (trade.wethSwap) {
    return toggleAmount(trade.tokenIn.amount, trade.tokenIn.token);
  }
  return toggleAmount(
    trade.tokenOut.amount
      .mul(BigNumber.from(10).pow(trade.tokenIn.token.decimals))
      .div(trade.tokenIn.amount.add(1)),
    trade.tokenOut.token,
  );
};

export const calculateSensibleMax = (token: TokenInfo, balance: BigNumber) => {
  const forGas = BigNumber.from(10).pow(16);
  let amount = balance;
  if (isNativeToken(token)) {
    amount = balance.lt(forGas) ? BigNumber.from(0) : balance.sub(forGas);
  }
  return toggleAmount(amount, token, { precision: token.decimals });
};
