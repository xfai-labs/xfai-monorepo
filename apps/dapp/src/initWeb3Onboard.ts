import { init } from '@web3-onboard/react';
import { Chains, Mainnet, SupportedChainIds } from '@xfai-labs/sdk';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import ledgerModule from '@web3-onboard/ledger';
import coinbaseModule from '@web3-onboard/coinbase';
import metamaskModule from '@web3-onboard/metamask';
import type { OnboardAPI } from '@web3-onboard/core';
import MainConfig from '@dapp/config/MainConfig';
import onboardLogo from '@dapp/assets/onboard-logo.svg';
import gnosisModule from '@web3-onboard/gnosis';

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const injected = injectedModule();
const ledger = ledgerModule({
  projectId: WALLET_CONNECT_PROJECT_ID,
  walletConnectVersion: 2,
});
const metamask = metamaskModule({
  options: {
    dappMetadata: {
      url: 'https://app.xfai.com',
      name: 'Xfai',
    },
  },
});
const coinbase = coinbaseModule();
const walletConnect = walletConnectModule({
  version: 2,
  requiredChains: [Mainnet.chainId],
  optionalChains: SupportedChainIds,
  projectId: WALLET_CONNECT_PROJECT_ID,
  dappUrl: 'https://app.xfai.com',
});
const gnosis = gnosisModule();

export default function initWeb3Onboard(): OnboardAPI {
  return init({
    disableFontDownload: true,
    connect: {
      autoConnectLastWallet: true,
      disableUDResolution: true,
    },
    wallets: [injected, ledger, coinbase, walletConnect, gnosis, metamask],
    chains: Object.entries(Chains).map(([chain_id, chain]) => ({
      id: Number(chain_id),
      token: chain.nativeToken.symbol,
      icon: chain.logoUri,
      label: chain.label,
      rpcUrl: chain.rpcUrl,
      blockExplorerUrl: chain.blockExplorerUrl,
    })),
    appMetadata: {
      name: MainConfig.SITE_NAME,
      icon: onboardLogo,
      description: MainConfig.SITE_DESCRIPTION,
      recommendedInjectedWallets: [
        { name: 'MetaMask', url: 'https://metamask.io' },
        { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      ],
      agreement: {
        version: MainConfig.SITE_VERSION,
        termsUrl: MainConfig.TERMS_OF_USE_URL,
      },
    },
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
  });
}
