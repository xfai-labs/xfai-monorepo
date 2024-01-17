import Layout from './Layout';
import Logo from './Logo';
import { NavLink } from 'react-router-dom';
import NextActiveLink from './NextActiveLink';
import Navigation from './Navigation';
import SocialMedia from './SocialMedia';
import NavigationItem from '../types/NavigationItem';
import cs from 'classnames';
import { HTMLProps, FunctionComponent } from 'react';

type Props = {
  NavLink: typeof NavLink | NextActiveLink;
  navigationItems: NavigationItem[];
  navigationDisabled?: boolean;
  fluid?: boolean;
} & HTMLProps<HTMLDivElement>;

const Footer: FunctionComponent<Props> = ({
  NavLink,
  navigationItems,
  navigationDisabled,
  fluid = false,
  className,
  ...props
}) => {
  return (
    <footer
      className={cs(
        'bg-90 relative z-[1] flex flex-col items-center pb-7 pt-5 lg:py-4 xl:py-5 2xl:py-6',
        className,
      )}
      {...props}
    >
      <Layout.Container
        className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-0"
        fluid={fluid}
      >
        <div className="order-2 flex flex-col items-center gap-4 justify-self-center md:order-1 md:items-start md:pt-3">
          <NavLink to={'/'} href={'/'} aria-label="Xfai Footer Logo">
            <Logo mono className="h-5 md:h-6" />
          </NavLink>
          <p className="text-sm leading-none dark:text-white">©{new Date().getFullYear()} XFAI</p>
        </div>
        <div className="order-1 flex flex-col items-center gap-3 justify-self-center md:order-2 md:items-end 2xl:gap-4">
          <Navigation
            className="text-sm font-normal 2xl:text-base"
            itemClassName="!py-0 before:hidden !text-10 dark:!text-white hover:!text-magenta dark:hover:!text-magenta transition-[color] duration-100"
            items={navigationItems}
            NavLink={NavLink}
            disabled={navigationDisabled}
          />
          <SocialMedia />
        </div>
      </Layout.Container>
    </footer>
  );
};

export default Footer;
