import NavigationItem from '../types/NavigationItem';
import { NavLink, useLocation } from 'react-router-dom';
import NextActiveLink from './NextActiveLink';
import { motion } from 'framer-motion';
import cs from 'classnames';
import { HTMLProps, forwardRef, useState, useEffect, createElement } from 'react';
import NavigationDropdown from './NavigationDropdown';
import { IconMore } from './assets/icons';
import SocialMedia from './SocialMedia';

type Props = {
  items: NavigationItem[];
  subNavigationItems?: NavigationItem[];
  NavLink: typeof NavLink | NextActiveLink;
  disabled?: boolean;
  itemClassName?: string;
} & HTMLProps<HTMLDivElement>;

const NavigationTabBar = forwardRef<HTMLDivElement, Props>(
  ({ items, subNavigationItems, NavLink, disabled, className, itemClassName, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const location = useLocation();

    useEffect(() => {
      setActiveIndex(items.findIndex((item) => item.path === location.pathname.split('/')[1]));
    }, [items, location]);

    return (
      <nav
        className={cs(
          'border-50 bg-60 fixed inset-x-0 bottom-0 z-[9] flex justify-center border-t',
          className,
        )}
        ref={ref}
        {...props}
      >
        <ul className="relative flex max-w-lg grow flex-nowrap">
          {items.map((item, index) => (
            <li className="relative basis-full" key={index}>
              <NavLink
                to={item.path}
                href={item.path}
                onClick={() => setActiveIndex(index)}
                className={cs(
                  'vxl:text-base vxl:gap-2 vxl:px-3 vxl:pt-3 pb-navbar relative flex w-full flex-col items-center gap-1.5 px-2.5 pt-2.5 text-sm font-medium uppercase transition-colors',
                  !disabled ? 'text-5' : 'text-30 pointer-events-none',
                  { '!text-white-blue': index === activeIndex },
                  itemClassName,
                )}
              >
                {item.icon &&
                  createElement(item.icon, {
                    className: cs(
                      'h-3.5 vxl:h-4 fill-5 transition-opacity',
                      !disabled ? 'opacity-50' : 'opacity-30',
                      {
                        '!opacity-100': index === activeIndex,
                      },
                    ),
                  })}
                {item.label}
              </NavLink>
              {index === activeIndex && (
                <motion.div
                  className="bg-magenta absolute inset-x-0 top-0 h-1"
                  layoutId="activeIndicator"
                />
              )}
            </li>
          ))}
          {subNavigationItems && (
            <li className="relative">
              <NavigationDropdown
                items={subNavigationItems}
                trigger={<IconMore className="h-6 w-6" />}
                className="h-full"
                triggerClassName="h-full !fill-10"
                dropdownClassName="mr-2.5"
                direction="top"
              >
                <SocialMedia
                  border={false}
                  iconSize="small"
                  iconColor="fill-5 dark:fill-white dark:hover:fill-magenta fill- hover:fill-magenta"
                  gap="gap-2.5"
                  className="p-2 pt-2.5"
                />
              </NavigationDropdown>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

export default NavigationTabBar;
