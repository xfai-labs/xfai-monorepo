import { motion, AnimatePresence } from 'framer-motion';
import NavigationItem from '../types/NavigationItem';
import SocialMedia from './SocialMedia';
import Navigation from './Navigation';
import { NavLink } from 'react-router-dom';
import NextActiveLink from './NextActiveLink';
import { HTMLProps, FunctionComponent } from 'react';

type NavigationHamburgerProps = {
  open: boolean;
  items: NavigationItem[];
  NavLink: typeof NavLink | NextActiveLink;
  disabled?: boolean;
} & Omit<
  HTMLProps<HTMLDivElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
>;

const NavigationHamburger: FunctionComponent<NavigationHamburgerProps> = ({
  open,
  items,
  NavLink,
  disabled,
  children,
  ...props
}) => {
  return (
    <AnimatePresence mode="sync">
      {open && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100vh' }}
          exit={{ height: 0 }}
          transition={{ type: 'spring', stiffness: 75, mass: 0.5, duration: 0.5 }}
          className="hamburger group/hamburger bg-90 max-safe-h-screen absolute inset-x-0 top-0 -z-10 overflow-hidden"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { type: 'spring', stiffness: 75, mass: 0.5, delay: 0.2, duration: 1 },
            }}
            exit={{
              opacity: 0,
              transition: { type: 'spring', stiffness: 75, mass: 0.5, duration: 0.5 },
            }}
            className="px-1/5 absolute inset-0 flex flex-col items-center justify-center gap-8 pb-12 pt-32"
          >
            <Navigation
              className="!gap-4 text-3xl font-normal md:text-4xl"
              itemClassName="!py-0 before:hidden hover:text-magenta transition-[color] duration-100"
              items={items}
              NavLink={NavLink}
              disabled={disabled}
            />
            <SocialMedia className="justify-center" />
            <p className="copyright">© {new Date().getFullYear()} XFAI</p>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationHamburger;
