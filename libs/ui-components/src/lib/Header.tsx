import { NavLink } from 'react-router-dom';
import NextActiveLink from './NextActiveLink';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenSizeChange } from './hook/use-screen-size-change';
import Logo from './Logo';
import NavigationItem from '../types/NavigationItem';
import Navigation from './Navigation';
import NavigationHamburger from './NavigationHamburger';
import ButtonHamburger from './ButtonHamburger';
import ButtonIcon from './ButtonIcon';
import Layout from './Layout';
import { IconMoreHorizontal, IconSettings } from './assets/icons';
import cs from 'classnames';
import { HTMLProps, forwardRef, useState, useEffect } from 'react';
import SocialMedia from './SocialMedia';
import NavigationDropdown from './NavigationDropdown';

type Props = {
  NavLink: typeof NavLink | NextActiveLink;
  navigationItems: NavigationItem[];
  hamburgerItems?: NavigationItem[];
  subNavigationItems?: NavigationItem[];
  navigationDisabled?: boolean;
  hamburgerNavigationDisabled?: boolean;
  mobileHiddenItems?: React.ReactNode;
  hamburgerChildren?: React.ReactNode;
  settingsOnClick?: () => void;
  fluid?: boolean;
  wrapperClassName?: string;
  headerMessage?: React.ReactNode;
  headerMessageClassName?: string;
  postLogoChildren?: React.ReactNode;
} & Omit<
  HTMLProps<HTMLDivElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
>;

const Header = forwardRef<HTMLDivElement, Props>(
  (
    {
      NavLink,
      navigationItems,
      hamburgerItems,
      subNavigationItems,
      navigationDisabled,
      hamburgerNavigationDisabled,
      mobileHiddenItems,
      hamburgerChildren,
      settingsOnClick,
      fluid = false,
      wrapperClassName,
      headerMessage,
      headerMessageClassName,
      postLogoChildren,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
    const { isMobile } = useScreenSizeChange();

    useEffect(() => {
      setHamburgerOpen(false);
    }, [isMobile]);

    return (
      <header
        key="header"
        className={cs(
          'group/header bg-90 text-white-blue fixed inset-x-0 top-0 z-20 flex flex-col items-center justify-center',
          className,
        )}
        ref={ref}
        {...props}
      >
        <Layout.Container
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -200, opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className={cs(
            'lg:py-0.75 flex items-center justify-between gap-4 bg-inherit py-0.5 transition-[padding] xl:gap-7 xl:py-1.5 2xl:py-2.5',
          )}
          fluid={fluid}
        >
          <div className="flex items-center gap-4">
            <NavLink to={'/'} href={'/'} aria-label="Xfai Logo">
              <Logo
                animated
                type={!isMobile || (isMobile && hamburgerOpen)}
                className="ml-1 !h-6 lg:ml-0 2xl:!h-8"
                onClick={() => setHamburgerOpen(false)}
              />
            </NavLink>
            {postLogoChildren && postLogoChildren}
          </div>
          <div className="ml-auto flex flex-nowrap items-center gap-2.5 lg:gap-5 xl:gap-7">
            <AnimatePresence mode="popLayout">
              {!isMobile && (
                <Navigation
                  key="headerNavigation"
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
                  className="text-base font-normal transition-[margin] xl:text-lg"
                  items={navigationItems}
                  NavLink={NavLink}
                  disabled={navigationDisabled}
                />
              )}
              {subNavigationItems && !isMobile && (
                <NavigationDropdown
                  items={subNavigationItems}
                  trigger={<IconMoreHorizontal className="h-6 w-6" />}
                >
                  <SocialMedia
                    border={false}
                    iconSize="small"
                    iconColor="fill-5 dark:fill-white dark:hover:fill-magenta fill- hover:fill-magenta"
                    gap="gap-2.5"
                    className="p-2 pt-2.5"
                  />
                </NavigationDropdown>
              )}
              {((isMobile && hamburgerOpen) || !isMobile) && mobileHiddenItems && (
                <motion.div
                  key="mobileHiddenWrapper"
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
                  className={cs(
                    'inline-flex items-center justify-end gap-2.5 transition-[margin] lg:gap-5 xl:gap-7',
                    wrapperClassName,
                  )}
                >
                  {mobileHiddenItems}
                </motion.div>
              )}
              {children && !hamburgerOpen && (
                <motion.div
                  key="childrenWrapper"
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
                  className={cs(
                    'inline-flex items-center justify-end gap-2.5 transition-[margin] lg:gap-5 xl:gap-7',
                    wrapperClassName,
                  )}
                >
                  {children}
                </motion.div>
              )}
              {settingsOnClick && (
                <ButtonIcon
                  key="settingsButton"
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
                  className="button-settings"
                  size="header"
                  icon={IconSettings}
                  color="fill-white-blue"
                  bgColor="bg-transparent"
                  hoverEffect="rotate"
                  square
                  onClick={() => {
                    settingsOnClick();
                    setHamburgerOpen(false);
                  }}
                />
              )}
              {hamburgerItems && isMobile && (
                <ButtonHamburger
                  key="hamburgerButton"
                  className="inline-flex"
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
                  toggled={hamburgerOpen}
                  onClick={() => setHamburgerOpen(!hamburgerOpen)}
                />
              )}
            </AnimatePresence>
          </div>
        </Layout.Container>
        {hamburgerItems && isMobile && (
          <NavigationHamburger
            open={hamburgerOpen}
            items={hamburgerItems}
            NavLink={NavLink}
            disabled={hamburgerNavigationDisabled}
            children={hamburgerChildren}
          />
        )}
        {headerMessage && (
          <div
            className={cs(
              'text-xsm bg-magenta w-full p-2 text-center font-medium text-white',
              headerMessageClassName,
            )}
          >
            {headerMessage}
          </div>
        )}
      </header>
    );
  },
);

export default Header;
