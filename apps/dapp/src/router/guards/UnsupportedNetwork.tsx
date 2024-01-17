import useChain from '@dapp/hooks/chain/useChain';
import UnsupportedNetwork from '@dapp/pages/UnsupportedNetwork';

type Props = {
  children: JSX.Element;
};

const UnsupportedNetworkGuard = ({ children }: Props) => {
  const chain = useChain();
  if (!chain) return <UnsupportedNetwork />;

  return children;
};
export default UnsupportedNetworkGuard;
