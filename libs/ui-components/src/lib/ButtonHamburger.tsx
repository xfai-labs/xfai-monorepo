import { motion } from 'framer-motion';
import cs from 'classnames';
import { HTMLProps, forwardRef } from 'react';

type Props = {
  toggled: boolean;
} & Omit<HTMLProps<HTMLButtonElement>, 'type'>;

const ButtonHamburger = forwardRef<HTMLButtonElement, Props>(
  ({ toggled, className, ...props }, ref) => {
    return (
      <button
        className={cs(
          'group/button-hamburger text-5 h-12 w-12 cursor-pointer p-3 outline-none',
          { open: toggled },
          className,
        )}
        {...props}
        ref={ref}
      >
        <div className="relative h-full w-full">
          <span className="top-0.75 absolute left-0 h-0.5 w-full origin-center transform rounded-full bg-current transition-all group-[.open]/button-hamburger:left-1/2 group-[.open]/button-hamburger:top-1/2 group-[.open]/button-hamburger:-translate-x-1/2 group-[.open]/button-hamburger:-translate-y-1/2 group-[.open]/button-hamburger:rotate-45" />
          <span className="absolute left-0 top-1/2 h-0.5 w-full origin-center -translate-y-1/2 rounded-full bg-current transition-all group-[.open]/button-hamburger:w-0 group-[.open]/button-hamburger:opacity-0" />
          <span className="bottom-0.75 absolute left-0 h-0.5 w-full origin-center transform rounded-full bg-current transition-all group-[.open]/button-hamburger:bottom-1/2 group-[.open]/button-hamburger:left-1/2 group-[.open]/button-hamburger:-translate-x-1/2 group-[.open]/button-hamburger:translate-y-1/2 group-[.open]/button-hamburger:-rotate-45" />
        </div>
      </button>
    );
  },
);

const ButtonHamburgerMotion = motion(ButtonHamburger);
export default ButtonHamburgerMotion;
