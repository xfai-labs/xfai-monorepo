import { FunctionComponent, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import cs from 'classnames';

const AppCard: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({ className, children }) => {
  return (
    <motion.div
      className={cs(
        'bg-60/50 border-60/20 dark:border-60 flex w-full flex-col gap-4 rounded-2xl border bg-opacity-90 p-2.5 lg:p-3 xl:gap-5 xl:p-3.5',
        className,
      )}
      exit={{ height: 0, opacity: 0, overflow: 'hidden', paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
};

export default AppCard;
