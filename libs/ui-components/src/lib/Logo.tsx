import { motion, AnimatePresence } from 'framer-motion';
import LogoIconAnimated from './LogoIconAnimated';
import LogoIconStatic from './assets/Logo/logoIconStatic';
import { ReactComponent as LogoType } from './assets/Logo/logoType.svg';
import cs from 'classnames';
import { forwardRef } from 'react';

type Props = {
  animated?: boolean;
  mono?: boolean;
  type?: boolean;
  className?: string;
  onClick?: () => void;
};

const Logo = forwardRef<HTMLDivElement, Props>(
  ({ mono, animated, type = true, className, onClick }, ref) => {
    return (
      <div
        className={cs('flex h-[34px] items-center justify-start gap-[8px]', className)}
        onClick={onClick}
        ref={ref}
      >
        {animated ? (
          <LogoIconAnimated mono={mono} className="h-full w-auto shrink-0" type="header" />
        ) : (
          <LogoIconStatic mono={mono} className="h-full w-auto shrink-0" />
        )}
        <AnimatePresence mode="popLayout">
          {type && (
            <motion.span
              key="logoType"
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
              className={cs(
                'flex h-[90%] items-center',
                !mono ? 'fill-white-blue' : 'fill-10 dark:fill-white',
              )}
            >
              <LogoType className="aspect-[140/36] h-full w-auto shrink-0" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

const LogoMotion = motion(Logo);
export default LogoMotion;
