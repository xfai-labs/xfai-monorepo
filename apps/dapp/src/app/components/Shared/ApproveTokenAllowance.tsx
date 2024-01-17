import useRequestTokenAllowance from '@dapp/hooks/account/useRequestTokenAllowance';
import Localization from '@dapp/localization';
import { TokenInfo } from '@uniswap/token-lists';
import { Button } from '@xfai-labs/ui-components';
import { useEffect } from 'react';

const ApproveTokenAllowance = ({
  token,
  inftPeriphery,
}: {
  token: TokenInfo;
  inftPeriphery?: true;
}) => {
  const {
    mutate: allowTokenAllowance,
    isConfirming,
    isLoading,
    isSuccess,
    reset,
  } = useRequestTokenAllowance(inftPeriphery);

  useEffect(() => {
    reset();
  }, [reset, token.address]);

  let text = `${Localization.Button.ALLOW_XFAI_TO_USE_YOUR} ${token.symbol}`;
  if (isConfirming) {
    text = Localization.Label.CONFIRMING;
  }
  if (isLoading) {
    text = Localization.Label.PROCESSING;
  }
  if (isSuccess) {
    text = Localization.Label.APPROVED;
  }

  return (
    <Button
      type="submit"
      bgColor="bg-cyan hover:bg-cyan-dark"
      size="xl"
      disabled={isConfirming || isSuccess || isLoading}
      onClick={() => allowTokenAllowance(token)}
    >
      {text}
    </Button>
  );
};

export default ApproveTokenAllowance;
