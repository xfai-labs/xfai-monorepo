import { useStakeGasEstimate } from '@dapp/hooks/stake/useStake';
import Stake from '@dapp/types/Stake';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import Gas from './Gas';
import Localization from '@dapp/localization';

type Props = {
  stake: Stake;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
};

const StakeDetails: FunctionComponent<Props> = ({ stake, result, receipt }) => {
  const estimate = useStakeGasEstimate(stake);

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
      <span className="text-xsm">{Localization.Label.ESTIMATED_GAS_FEE}</span>
      <Gas estimate={estimate} result={result} receipt={receipt} />
    </motion.div>
  );
};

export default StakeDetails;
