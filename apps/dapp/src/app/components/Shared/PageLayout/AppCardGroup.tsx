import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import cs from 'classnames';

const AppCardGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => {
    return (
      <div className={cs('relative flex w-full flex-col gap-2 2xl:gap-3', className)} ref={ref}>
        {children}
      </div>
    );
  },
);

const AppCardGroupMotion = motion(AppCardGroup);
export default AppCardGroupMotion;
