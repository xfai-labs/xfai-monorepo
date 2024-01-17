import NavigationItem from '../types/NavigationItem';
import { AnimatePresence, motion } from 'framer-motion';
import cs from 'classnames';
import { HTMLProps, createElement, forwardRef } from 'react';
import { Menu } from '@headlessui/react';

type Props = {
  items: NavigationItem[];
  trigger: React.ReactNode;
  triggerClassName?: string;
  itemClassName?: string;
  dropdownClassName?: string;
  direction?: 'bottom' | 'top';
} & HTMLProps<HTMLDivElement>;

const NavigationDropdown = forwardRef<HTMLDivElement, Props>(
  (
    {
      items,
      trigger,
      className,
      triggerClassName,
      dropdownClassName,
      itemClassName,
      children,
      direction = 'bottom',
    },
    ref,
  ) => {
    return (
      <Menu as="div" className={cs('relative', className)} ref={ref}>
        <AnimatePresence mode="popLayout">
          <Menu.Button
            key="subNavigationTrigger"
            className={cs(
              'fill-white-blue hover:fill-magenta flex items-center justify-center p-2 focus:outline-none',
              triggerClassName,
            )}
          >
            {trigger}
          </Menu.Button>
          <Menu.Items
            as={motion.div}
            key="subNavigationItems"
            initial={{ y: direction === 'bottom' ? 25 : -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction === 'bottom' ? 25 : -25, opacity: 0 }}
            transition={{ type: 'linear', duration: 0.1 }}
            className={cs(
              'bg-60/60 ring-white-black border-px border-white-black/5 absolute right-0 flex w-56 flex-col gap-1.5 rounded-lg p-2 shadow-2xl backdrop-blur-xl',
              direction === 'bottom'
                ? 'mt-2 origin-top-right'
                : `bottom-[70px] origin-bottom-right`,
              dropdownClassName,
            )}
          >
            {items.map((item) => (
              <Menu.Item key={item.path}>
                <a
                  className={cs(
                    'fill-5 hover:fill-magenta dark:hover:fill-magenta text-10 text-xsm hover:bg-40/60 dark:hover:bg-30/60 group flex items-center gap-2.5 rounded-md px-3 py-3 first:border-none dark:fill-white dark:text-white',
                    itemClassName,
                  )}
                  href={item.path}
                  target={item.external ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  {item.icon &&
                    createElement(item.icon, {
                      className: cs('h-4 w-4'),
                    })}
                  {item.label}
                </a>
              </Menu.Item>
            ))}
            {children && (
              <>
                <hr className="border-40/60 dark:border-30/60" />
                {children}
              </>
            )}
          </Menu.Items>
        </AnimatePresence>
      </Menu>
    );
  },
);

const NavigationDropdownMotion = motion(NavigationDropdown);
export default NavigationDropdownMotion;
