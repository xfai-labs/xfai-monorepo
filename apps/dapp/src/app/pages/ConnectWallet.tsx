import connectWalletImageURL from '@dapp/assets/connectWallet.png';
import ZeroPage from '../components/Shared/ZeroPage';
import PageTitle from '../components/Shared/PageLayout/PageTitle';
import Localization from '@dapp/localization';
import { Button } from '@xfai-labs/ui-components';
import { useConnectWallet } from '@web3-onboard/react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function ConnectWallet() {
  const [{ wallet }, connect] = useConnectWallet();
  const [query, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.from) {
      setSearchParams({ redirect: state?.from ?? '/' });
    }
  }, [state?.from, setSearchParams]);

  useEffect(() => {
    if (wallet) {
      navigate(query.get('redirect') ?? '/', { replace: true });
    }
  }, [navigate, wallet, query]);

  return (
    <ZeroPage image={{ src: connectWalletImageURL, alt: 'Connect Wallet Cover' }}>
      <PageTitle title={Localization.Connect.PageInfo.TITLE} normalCase>
        {Localization.Connect.PageInfo.DESCRIPTION}
      </PageTitle>
      <Button size="xxl" onClick={() => connect()}>
        {Localization.Connect.Button.CONNECT_WALLET}
      </Button>
    </ZeroPage>
  );
}
