import { Xfai, getPoolStateMulticall } from '@xfai-labs/sdk';
import { getTokens } from './getTokens';
import { BigNumber } from 'ethers';
import { getClosestBlock } from '../utils/etherscan';
import { getBalance, getHarvestedFees } from '../utils/pools';

const PERIODS = {
  day: 86400,
  week: 7 * 86400,
} as const;

const PeriodNames = Object.keys(PERIODS);
type PeriodNames = keyof typeof PERIODS;

const isValidPeriod = (period: string | null): period is PeriodNames =>
  !!period && PeriodNames.includes(period);

export const getINFTFees = async (xfai: Xfai, period: PeriodNames) => {
  const periodInSeconds = PERIODS[period];
  const currentBlock = await xfai.provider.getBlock('latest');

  // Etherscan gives us the closest block before the timestamp
  const previousBlockNumber = await getClosestBlock(xfai, currentBlock.timestamp - periodInSeconds);

  // Fetch all the tokens that have pools
  const tokens = await getTokens(xfai);

  // Get the current token balances of the INFT contract
  const currentBalances = await getBalance(xfai, tokens, currentBlock.number);
  const pastBalances = await getBalance(xfai, tokens, previousBlockNumber);

  // Get the current harvested fees of tokens in the INFT contract
  const currentHarvestedFees = await getHarvestedFees(xfai, tokens, currentBlock.number);
  // Get the previous harvested fees of tokens in the INFT contract
  const previousHarvestedFees = await getHarvestedFees(xfai, tokens, previousBlockNumber);

  const tokenStates = await getPoolStateMulticall(xfai, tokens);
  const usdcState = tokenStates[xfai.usdc!.address];
  const tokenFees = tokens.map(({ address: tokenAddress }) => {
    const value = (currentBalances[tokenAddress] ?? BigNumber.from(0))
      .add(currentHarvestedFees[tokenAddress])
      .sub(pastBalances[tokenAddress] ?? BigNumber.from(0))
      .sub(previousHarvestedFees[tokenAddress] ?? BigNumber.from(0));
    const tokenState = tokenStates[tokenAddress];

    const ethValue = value.mul(tokenState.ethReserve).div(tokenState.reserve);

    let fiatValue = ethValue.mul(usdcState.reserve).div(usdcState.ethReserve);

    // <.3eth
    if (tokenState.ethReserve.lt(BigNumber.from(10).pow(17).mul(3))) {
      fiatValue = BigNumber.from(0);
    }

    return [
      tokenAddress,
      {
        value: value.toHexString(),
        ethValue: ethValue.toHexString(),
        fiatValue: fiatValue.toHexString(),
      },
    ];
  });

  return Object.fromEntries(tokenFees);
};

const RequestHandler: RouteHandler = async (xfai: Xfai, request: Request) => {
  const period = new URL(request.url).searchParams.get('period');

  if (!isValidPeriod(period)) {
    throw new Error(`Unknown period!\n Please use: ${PeriodNames.join(', ')}`);
  }

  return {
    content: await getINFTFees(xfai, period),
    cacheTime: 60 * 5,
  };
};

export default RequestHandler;
