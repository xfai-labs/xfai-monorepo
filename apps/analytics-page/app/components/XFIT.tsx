import { FunctionComponent, HTMLProps } from 'react';
import Localization from '@analytics/localization';
import Image from 'next/image';
import cs from 'classnames';
import { useScreenSizeChange } from '@xfai-labs/ui-components';
import { XFitStatsResponse } from '@analytics/types/backend';
import { AnimatePresence, motion } from 'framer-motion';

const MAX_XFIT = BigInt('400000000');

const XFIT: FunctionComponent<
  HTMLProps<HTMLDivElement> & {
    xfit: XFitStatsResponse;
  }
> = ({ xfit, className, ...props }) => {
  const { isMobile } = useScreenSizeChange();

  const daily_change =
    Number(
      (BigInt(xfit.daily_change) * BigInt(10000)) / BigInt(xfit.current) -
        BigInt(xfit.daily_change),
    ) / 100;

  const weekly_change =
    Number(
      (BigInt(xfit.weekly_change) * BigInt(10000)) / BigInt(xfit.current) -
        BigInt(xfit.weekly_change),
    ) / 100;
  return (
    <div
      className={cs(
        'border-60/20 dark:border-60 bg-60/50 text-white-blue relative flex overflow-hidden rounded-lg p-6 md:justify-center md:p-8 lg:p-10',
        className,
      )}
      {...props}
    >
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 3 }}
        >
          <span className="bg-magenta absolute left-0 top-0 z-0 aspect-square w-[600px] -translate-x-[40%] -translate-y-[65%] rounded-full lg:w-[1000px] lg:opacity-60" />
          <span className="bg-cyan absolute left-0 top-0 z-0 aspect-square w-[670px] -translate-x-[30%] translate-y-[10%] rounded-full lg:opacity-60" />
          <span className="bg-cyan absolute bottom-0 right-0 z-0 aspect-square w-[600px] translate-x-[30%] translate-y-[45%] rounded-full opacity-60 lg:w-[1000px]" />
          <span className="bg-magenta absolute bottom-0 right-0 z-0 aspect-square w-[670px] translate-x-[25%] translate-y-[80%] rounded-full opacity-60" />
        </motion.div>
      </AnimatePresence>
      <span className="bg-60/80 dark:bg-60/40 absolute inset-0 z-0 rounded-lg backdrop-blur-3xl" />
      <div className="z-10 flex flex-col gap-5 md:flex-row md:gap-20">
        <div className="bg-black-white/30 flex items-center gap-2 rounded-xl p-2 pr-4">
          <Image
            src="https://tokens.xfai.com/ethereum/0x4aa41bc1649c9c3177ed16caaa11482295fc7441.webp"
            alt="XFIT"
            width={38}
            height={38}
            className="rounded-md"
          />
          <div className="flex shrink-0 flex-col">
            <h3 className="text-5 text-base font-medium dark:text-white">XFIT</h3>
            <span className="-mt-0.5 text-xs">
              {Number(xfit.price).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 4,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-2xl font-medium lg:text-3xl">
            {(MAX_XFIT - BigInt(xfit.current)).toLocaleString()}
          </span>
          <h2 className="text-5 text-sm font-normal opacity-80 dark:text-white">
            {Localization.Label.XFIT_IN_CIRCULATION}
          </h2>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-medium lg:text-3xl">
            {BigInt(xfit.current).toLocaleString()}
          </span>
          <h2 className="text-5 text-sm font-normal opacity-80 dark:text-white">
            {Localization.Label.XFIT_PERMANENTLY_LOCKED}
          </h2>
        </div>
        {/* <div className="hidden grow items-center justify-center md:flex">
          <Chart.RadialProgress
            size={isMobile ? 120 : 160}
            thickness={isMobile ? 5 : 8}
            percentage={Number((BigInt(xfit.current) * BigInt(10000)) / MAX_XFIT) / 100}
            label="Permanently Locked"
          />
        </div> */}
      </div>
    </div>
  );
};

export default XFIT;
