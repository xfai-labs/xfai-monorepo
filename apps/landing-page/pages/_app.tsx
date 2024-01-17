import Link from 'next/link';
import { Rubik } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useElementSize } from 'usehooks-ts';
import {
  Header,
  Footer,
  Button,
  ThemeContext,
  useInitThemeContext,
  ThemeSwitch,
} from '@xfai-labs/ui-components';
import useDappLocation from '@landing/utils/dappLocation';
import Localization from '@landing/localization';
import MainConfig from '@landing/config/MainConfig';
import NavigationItems from '@landing/config/navigation';
import NextActiveLink from '@landing/components/NextActiveLink';
import BaseMetaTags from '@landing/components/Head/BaseTags';
import '@landing/style/main.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAnalyticsLocation from '@landing/utils/analyticsLocation';

const rubik = Rubik({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-family',
  display: 'swap',
});

const queryClient = new QueryClient();
function LandingPage({ Component, pageProps }) {
  const themeContext = useInitThemeContext();
  const [headerRef, { height: headerHeight }] = useElementSize();
  const dappLocation = useDappLocation();
  const analyticsLocation = useAnalyticsLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeContext}>
        <BaseMetaTags />
        <div className={`h-full w-full ${rubik.variable} font-sans`}>
          <Header
            NavLink={NextActiveLink}
            navigationItems={NavigationItems}
            hamburgerItems={NavigationItems}
            mobileHiddenItems={<ThemeSwitch />}
            ref={headerRef}
          >
            <Button
              size="large"
              NavLink={Link}
              target="_blank"
              href={dappLocation(MainConfig.APP_URL)}
              className="uppercase"
            >
              {Localization.OPEN_APP_BUTTON}
            </Button>
          </Header>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
            className="vxl:min-h-fit min-safe-h-screen relative flex h-full grow flex-col items-center"
            style={{ paddingTop: headerHeight }}
          >
            <AnimatePresence mode="wait">
              <Component {...pageProps} />
            </AnimatePresence>
          </motion.main>
          <Footer NavLink={NextActiveLink} navigationItems={NavigationItems} />
          {/* Fixes Metamask Browser static white background on HTML when scrolling */}
          <div className="bg-bg fixed inset-0 -z-30" />
        </div>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}
export default LandingPage;
