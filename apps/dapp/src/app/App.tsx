import { Route, Routes, Navigate } from 'react-router-dom';
import SwapPage from './pages/Swap';
import StakePage from './pages/Stake';
import LiquidityRoutes from './pages/Liquidity';
import NFTRoutes from './pages/NFTs';
import NotFound from './pages/NotFound';
import ConnectWallet from './pages/ConnectWallet';
import RouterLayout from '@dapp/router/RouterLayout';
import { GlobalModalProvider } from '@dapp/context/GlobalModal';
import { ThemeContext, useInitThemeContext } from '@xfai-labs/ui-components';
import { SavedTokensProvider } from '@dapp/context/SavedTokens';
import { LocalTransactionsProvider } from '@dapp/context/LocalTransactions';
import { TokensProvider } from '@dapp/context/Tokens';
import { HelmetProvider } from 'react-helmet-async';
import UnSupportedNetworkGuard from '@dapp/router/guards/UnsupportedNetwork';
import XfaiProvider from '@dapp/context/XfaiProvider';

const App = () => {
  const themeContext = useInitThemeContext();

  return (
    <HelmetProvider context={{}}>
      <XfaiProvider>
        <SavedTokensProvider>
          <LocalTransactionsProvider>
            <TokensProvider>
              <ThemeContext.Provider value={themeContext}>
                <GlobalModalProvider>
                  <Routes>
                    <Route path="/" element={<RouterLayout />}>
                      <Route index element={<Navigate to={'/swap'} />} />
                      <Route
                        path="/swap"
                        element={
                          <UnSupportedNetworkGuard>
                            <SwapPage />
                          </UnSupportedNetworkGuard>
                        }
                      />
                      <Route
                        path="/liquidity/*"
                        element={
                          <UnSupportedNetworkGuard>
                            <LiquidityRoutes />
                          </UnSupportedNetworkGuard>
                        }
                      />
                      <Route
                        path="/stake/:inftId?"
                        element={
                          <UnSupportedNetworkGuard>
                            <StakePage />
                          </UnSupportedNetworkGuard>
                        }
                      />
                      <Route
                        path="/inft/*"
                        element={
                          <UnSupportedNetworkGuard>
                            <NFTRoutes />
                          </UnSupportedNetworkGuard>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/connect-wallet" element={<ConnectWallet />} />
                    </Route>
                  </Routes>
                </GlobalModalProvider>
              </ThemeContext.Provider>
            </TokensProvider>
          </LocalTransactionsProvider>
        </SavedTokensProvider>
      </XfaiProvider>
    </HelmetProvider>
  );
};

export default App;
