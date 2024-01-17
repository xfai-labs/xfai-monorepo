import Spinner from './Spinner';
import { motion } from 'framer-motion';
import cs from 'classnames';
import { forwardRef, HTMLProps } from 'react';

const PageLoader = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cs(
          'bg-90 text-white-blue flex min-w-[18rem] items-center gap-2.5 rounded-[1.25rem] p-2 font-medium lg:p-3',
          className,
        )}
        {...props}
        ref={ref}
      >
        <Spinner round />
        <p className="grow">{children}</p>
      </div>
    );
  },
);

const PageLoaderMotion = motion(PageLoader);
export default PageLoaderMotion;
