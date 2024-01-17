import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import initWeb3Onboard from './initWeb3Onboard';
import { Web3OnboardProvider } from '@web3-onboard/react';
import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { AppContextComponent } from './context/AppContext';

Sentry.init({
  dsn: 'https://e3e38e7c327543018feebd7fb2796c6e@o4504759056728064.ingest.sentry.io/4504769310687232',
  integrations: [
    new Sentry.Replay({
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.05,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.02,
  enabled: process.env.NODE_ENV === 'production',
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

const web3Onboard = initWeb3Onboard();

root.render(
  <StrictMode>
    <BrowserRouter>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <QueryClientProvider client={queryClient}>
          <AppContextComponent>
            <>
              <ReactQueryDevtools initialIsOpen={false} />
              <App />
            </>
          </AppContextComponent>
        </QueryClientProvider>
      </Web3OnboardProvider>
    </BrowserRouter>
  </StrictMode>,
);
