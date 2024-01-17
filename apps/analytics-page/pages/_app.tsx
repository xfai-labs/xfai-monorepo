import Link from 'next/link';
import { Rubik } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useElementSize } from 'usehooks-ts';
import {
  Header,
  Footer,
  ThemeContext,
  useInitThemeContext,
  Layout,
  ThemeSwitch,
  Button,
} from '@xfai-labs/ui-components';
import NavigationItems from '@analytics/config/navigation';
import NextActiveLink from '@analytics/components/NextActiveLink';
import '@analytics/style/main.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useDappLocation from '@analytics/utils/dappLocation';
import Localization from '@analytics/localization';
import MainConfig from '@analytics/config/MainConfig';
import BaseMetaTags from '@analytics/components/Head/BaseTags';
import DropdownNetworkSelect from '@analytics/components/NetworkSelectDropdown';
import { useRouter } from 'next/router';

const rubik = Rubik({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-family',
  display: 'swap',
});

const queryClient = new QueryClient();
function AnalyticsPage({ Component, pageProps }) {
  const themeContext = useInitThemeContext();
  const [headerRef, { height: headerHeight }] = useElementSize();
  const dappLocation = useDappLocation();
  const router = useRouter();
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
            // TODO: add last updated
            // postLogoChildren={
            //   <div className="bg-70 text-5 py- rounded-md p-2 text-[0.65rem] leading-none">
            //     Last Updated: <span className="text-cyan">Jul 08 09:24</span>
            //   </div>
            // }
          >
            <DropdownNetworkSelect />
            <Button
              size="large"
              NavLink={Link}
              target="_blank"
              href={dappLocation(MainConfig.APP_URL)}
              className="uppercase"
            >
              {Localization.Button.OPEN_APP}
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
              <Layout.Container className="relative flex h-full grow flex-col py-4 md:py-6 xl:py-7">
                <Component {...pageProps} />
              </Layout.Container>
            </AnimatePresence>
          </motion.main>
          <Footer NavLink={NextActiveLink} navigationItems={NavigationItems} />
        </div>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}
export default AnalyticsPage;
