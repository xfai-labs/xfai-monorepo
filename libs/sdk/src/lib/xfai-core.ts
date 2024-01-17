import { Xfai } from './xfai';
import type { ReturnValue } from '@enzoferey/ethers-error-parser';
import { IXfaiV0Core__factory } from '@xfai-labs/dex';
export type ParsedEthersError = {
  type: 'ParsedEthersError';
  error: Error;
  context: ReturnValue;
};

export function getCore(xfai: Xfai) {
  return IXfaiV0Core__factory.connect(xfai.coreAddress, xfai.provider);
}

export const isParsedEthersError = (error: unknown): error is ParsedEthersError => {
  return (error as ParsedEthersError)?.type === 'ParsedEthersError';
};
