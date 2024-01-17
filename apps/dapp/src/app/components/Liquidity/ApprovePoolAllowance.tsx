import useRequestPoolAllowance from '@dapp/hooks/account/useRequestPoolAllowance';
import { Button } from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import { motion } from 'framer-motion';
import { Token } from '@xfai-labs/sdk';
import { useMemo } from 'react';

const ApprovePoolAllowance = ({ token }: { token: Token }) => {
  const {
    mutate: allowPoolAllowance,
    isConfirming,
    isLoading,
    isSuccess,
  } = useRequestPoolAllowance();

  const text = useMemo(() => {
    if (isConfirming) {
      return Localization.Label.CONFIRMING;
    }
    if (isLoading) {
      return Localization.Label.PROCESSING;
    }
    if (isSuccess) {
      return Localization.Label.APPROVED;
    }
    return `${Localization.Liquidity.Manage.Button.ALLOW_XFAI_TO_USE_YOUR_LIQUIDITY_TOKENS}`;
  }, [isConfirming, isLoading, isSuccess]);

  return (
    <motion.div
      key={token.address}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: `auto`, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'linear' }}
      className="flex flex-col overflow-hidden"
    >
      <Button
        key={token.address}
        type="submit"
        bgColor="bg-cyan hover:bg-cyan-dark"
        size="medium"
        disabled={isConfirming || isSuccess || isLoading}
        onClick={() => allowPoolAllowance(token)}
      >
        {text}
      </Button>
    </motion.div>
  );
};

export default ApprovePoolAllowance;
