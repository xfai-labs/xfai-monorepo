import { Outlet, NavLink } from 'react-router-dom';
import {
  Layout,
  Header,
  Footer,
  NavigationTabs,
  useScreenSizeChange,
} from '@xfai-labs/ui-components';

import WalletButton from '@dapp/components/WalletButton';
import DropdownNetworkSelect from '@dapp/components/NetworkSelectDropdown';
import NavigationItems from '@dapp/config/NavigationItems';
import SubNavigationItems from '@dapp/config/SubNavigationItems';
import ExternalNavigationItems from '@dapp/config/ExternalNavigationItems';

import { motion } from 'framer-motion';

import { useGlobalModalContext } from '@dapp/context/GlobalModal';
import { useElementSize } from 'usehooks-ts';

const RouterLayout = () => {
  const { showSettings } = useGlobalModalContext();
  const { isMobile } = useScreenSizeChange();
  const [headerRef, { height: headerHeight }] = useElementSize();
  const [tabBarRef, { height: tabBarHeight }] = useElementSize();

  const xfaiVersion = (
    <span className="text-30 absolute bottom-0 right-0 p-4 text-xs">{__XFAI_DAPP_VERSION__}</span>
  );

  return (
    <>
      <Header
        NavLink={NavLink}
        navigationItems={NavigationItems}
        settingsOnClick={() => showSettings()}
        fluid
        ref={headerRef}
        wrapperClassName="!gap-2.5"
        subNavigationItems={SubNavigationItems}
      >
        <DropdownNetworkSelect />
        <WalletButton />
      </Header>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className="vxl:min-h-fit min-safe-h-screen relative flex h-full grow flex-col items-center"
        style={{ paddingTop: headerHeight, paddingBottom: tabBarHeight }}
      >
        <Layout.Container fluid className="relative flex h-full grow flex-col py-4 md:py-6 xl:py-7">
          <Outlet />
        </Layout.Container>
        {!isMobile && xfaiVersion}
      </motion.main>
      {isMobile ? (
        <NavigationTabs
          NavLink={NavLink}
          items={NavigationItems}
          subNavigationItems={SubNavigationItems}
          ref={tabBarRef}
        />
      ) : (
        <Footer NavLink={NavLink} navigationItems={ExternalNavigationItems} fluid />
      )}
      {/* Fixes Metamask Browser static white background on HTML when scrolling */}
      <div className="bg-bg fixed inset-0 -z-30" />
    </>
  );
};

export default RouterLayout;
