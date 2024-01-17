import { INFT, getINFTTokenBalance } from '@xfai-labs/sdk';
import useXfaiQuery from '../meta/useXfaiQuery';
import { TokenInfo } from '@uniswap/token-lists';

export function useINFTTokenBalance(inft: INFT, token: TokenInfo) {
  return useXfaiQuery(['inftBalance', inft.id.toString(), token.address], (xfai) =>
    getINFTTokenBalance(xfai, inft, token),
  );
}
