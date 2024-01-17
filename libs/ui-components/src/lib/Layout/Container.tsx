import { forwardRef, HTMLProps } from 'react';
import { motion } from 'framer-motion';
import cs from 'classnames';

const Container = forwardRef<HTMLDivElement, { fluid?: boolean } & HTMLProps<HTMLDivElement>>(
  ({ fluid = false, className, children, ...props }, ref) => {
    return (
      <div
        className={cs(
          fluid ? 'px-2 2xl:container lg:px-4 2xl:px-5' : 'px-2 md:container',
          'w-full',
          className,
        )}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

const ContainerMotion = motion(Container);
export default ContainerMotion;
