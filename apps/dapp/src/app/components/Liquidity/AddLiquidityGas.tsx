import { ContractReceipt, ContractTransaction } from 'ethers';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import Gas from '@dapp/components/Gas';
import Localization from '@dapp/localization';
import { AddLiquidity, useLiquidityAddGasEstimate } from '@dapp/hooks/liquidity/useLiquidityAdd';

type Props = {
  addLiquidity: AddLiquidity;
  result?: ContractTransaction;
  receipt?: ContractReceipt;
};

const AddLiquidityGas: FunctionComponent<Props> = ({ addLiquidity, result, receipt }) => {
  const estimate = useLiquidityAddGasEstimate(addLiquidity);

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

export default AddLiquidityGas;
