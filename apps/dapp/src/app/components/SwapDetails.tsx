import { useSwapGasEstimate } from '@dapp/hooks/swap/useSwap';
import Swap from '@dapp/types/Swap';
import { deriveTradeExchangeRates } from '@dapp/utils/trade';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import Gas from './Gas';
import { TokenSwapLogos } from '@dapp/components/Token/TokenSwapLogos';

type Props = {
  swap: Swap;
  refetch?: boolean;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
};

const SwapDetails: FunctionComponent<Props> = ({ swap, refetch = false, result, receipt }) => {
  const estimate = useSwapGasEstimate(swap, refetch);

  return (
    <motion.div
      className="flex items-center justify-between leading-none"
      initial={{
        height: 0,
        opacity: 0,
        overflow: 'hidden',
      }}
      animate={{
        height: 'auto',
        opacity: 1,
        overflow: 'visible',
      }}
      exit={{
        height: 0,
        opacity: 0,
        overflow: 'hidden',
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-1">
        <TokenSwapLogos tokenIn={swap.tokenIn.token} tokenOut={swap.tokenOut.token} />
        <span className="text-5 text-xsm">
          <span className="font-medium">1 {swap.tokenIn.token.symbol}</span>
          <span className="text-10">{' = '}</span>
          <span className="font-medium">{`${deriveTradeExchangeRates(swap)} ${
            swap.tokenOut.token.symbol
          }`}</span>
        </span>
      </div>
      <Gas estimate={estimate} result={result} receipt={receipt} />
    </motion.div>
  );
};

export default SwapDetails;
