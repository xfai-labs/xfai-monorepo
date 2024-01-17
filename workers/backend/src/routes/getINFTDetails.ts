import { INFT, Xfai, getINFTTokenBalanceMulticall, getPoolStateMulticall } from '@xfai-labs/sdk';
import { getTokens } from './getTokens';
import { BigNumber } from 'ethers';

const getINFTDetails = async (xfai: Xfai, inft: INFT) => {
  const tokens = await getTokens(xfai);
  const tokenStates = await getPoolStateMulticall(xfai, tokens);
  const balances = await getINFTTokenBalanceMulticall(xfai, inft, tokens, true);

  const usdcState = tokenStates[xfai.usdc!.address];
  const fiatBalances = Object.entries(balances)
    .filter(([_, a]) => Boolean(a))
    .map(([tokenAddress, balance]) => {
      const amount = balance?.amount ?? BigNumber.from(0);
      const tokenState = tokenStates[tokenAddress];
      const ethValue = amount.mul(tokenState.ethReserve).div(tokenState.reserve);
      let fiatValue = ethValue.mul(usdcState.reserve).div(usdcState.ethReserve);
      // <.3eth
      if (tokenState.ethReserve.lt(BigNumber.from(10).pow(17).mul(3))) {
        fiatValue = BigNumber.from(0);
      }
      return [
        tokenAddress,
        {
          ethValue: ethValue.toHexString(),
          fiatValue: fiatValue.toHexString(),
        },
      ];
    });
  return Object.fromEntries(fiatBalances);
};

const RequestHandler: RouteHandler = async (xfai: Xfai, request: Request) => {
  const url = new URL(request.url);
  const inftIdString = url.searchParams.get('inftId');
  const inftID = Number(inftIdString);
  if (!inftID || Number.isNaN(inftID)) {
    return undefined;
  }

  return {
    content: await getINFTDetails(xfai, INFT(Number(inftID))),
    cacheTime: 60,
  };
};

export default RequestHandler;
