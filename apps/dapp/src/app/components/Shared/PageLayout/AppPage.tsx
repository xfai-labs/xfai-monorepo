import { FunctionComponent, HTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader } from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import cs from 'classnames';

type Props = {
  pageKey?: string;
  isLoading?: boolean;
  loadingLabel?: string;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>;

const AppPage: FunctionComponent<Props> = ({
  isLoading = false,
  loadingLabel = Localization.Label.FETCHING_DATA,
  className,
  children,
  pageKey,
  ...props
}) => {
  return (
    <>
      <motion.div
        key={pageKey}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 200, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
        className={cs(
          'flex w-full grow flex-col items-center gap-4 self-stretch  md:gap-6 xl:gap-7 [&>.row]:w-full',
          { 'overflow-hidden': isLoading },
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
      <AnimatePresence mode="sync">
        {isLoading && loadingLabel && (
          <div className="absolute bottom-0 left-1/2 z-50 mx-auto -translate-x-1/2 overflow-hidden px-1 pb-5 pt-1 lg:pb-10">
            <PageLoader
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
            >
              {loadingLabel}
            </PageLoader>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppPage;
