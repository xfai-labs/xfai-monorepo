import { useConnectWallet } from '@web3-onboard/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@dapp/context/AppContext';

type Props = {
  children: JSX.Element;
};

const RequireWallet = ({ children }: Props): JSX.Element => {
  const [{ wallet }] = useConnectWallet();
  const location = useLocation();
  const { web3IsLoading } = useAppContext();

  if (wallet || web3IsLoading) return children;

  return <Navigate to={`/connect-wallet`} replace state={{ from: location.pathname }} />;
};

export default RequireWallet;
