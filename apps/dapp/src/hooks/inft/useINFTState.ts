import { getINFTState } from '@xfai-labs/sdk';
import useXfaiQuery from '../meta/useXfaiQuery';

const useINFTState = () => {
  return useXfaiQuery(['inftState'], (xfai) => getINFTState(xfai, {}), {
    staleTime: Infinity,
  });
};

export default useINFTState;
