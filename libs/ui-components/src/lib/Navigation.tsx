import NavigationItem from '../types/NavigationItem';
import { NavLink } from 'react-router-dom';
import NextActiveLink from './NextActiveLink';
import { motion } from 'framer-motion';
import cs from 'classnames';
import { HTMLProps, forwardRef } from 'react';

type Props = {
  items: NavigationItem[];
  NavLink: typeof NavLink | NextActiveLink;
  disabled?: boolean;
  itemClassName?: string;
} & HTMLProps<HTMLDivElement>;

const Navigation = forwardRef<HTMLDivElement, Props>(
  ({ items, NavLink, disabled, itemClassName, ...props }, ref) => {
    const itemClassNames = cs(
      'relative block py-2 2xl:py-2.5',
      'before:bg-magenta before:absolute before:bottom-0 before:left-0 before:block before:h-[3px] before:w-0 before:transition-[width] before:content-[""]',
      '[&.active]:before:w-full [&:not(.active)]:hover:before:w-1/2',
      !disabled ? 'text-white-blue' : 'text-20 pointer-events-none',
      itemClassName,
    );

    return (
      <div {...props} ref={ref}>
        <ul className="inline-flex flex-row flex-nowrap gap-5 transition-[gap] group-[]/hamburger:flex-col group-[]/hamburger:items-center 2xl:gap-7">
          {items?.map((item, index) => (
            <li key={index}>
              {item.external && (
                <a href={item.path} target="_blank" className={itemClassNames} rel="noreferrer">
                  {item.label}
                </a>
              )}
              {!item.external && (
                <NavLink to={item.path} href={item.path} replace={true} className={itemClassNames}>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

const NavigationMotion = motion(Navigation);
export default NavigationMotion;
