import { FunctionComponent, HTMLAttributes } from 'react';
import { FormTitle, SkeletonWrapper } from '@xfai-labs/ui-components';
import Localization from '@dapp/localization';
import cs from 'classnames';

type Props = {
  title?: string;
  last24Hours: undefined | string;
  last7Days: undefined | string;
  feeClassNames?: string;
} & HTMLAttributes<HTMLDivElement>;

const AccumulatedFees: FunctionComponent<Props> = ({
  title = Localization.Label.ACCUMULATED_FEES,
  last24Hours,
  last7Days,
  feeClassNames,
  className,
}) => {
  return (
    <div
      className={cs(
        'bg-60/50 dark:bg-60 border-60 flex flex-col gap-2 rounded-lg border p-2',
        className,
      )}
    >
      <FormTitle lightTitle size="small" title={title} />
      <div className="flex gap-2">
        <div
          className={cs(
            'bg-50 flex flex-1 flex-col gap-1 rounded-lg p-2.5 text-center',
            feeClassNames,
          )}
        >
          <span className="text-white-blue text-sm leading-none lg:text-base">
            {last24Hours ? (
              `$${last24Hours}`
            ) : (
              <span className="pb-1 text-xs">
                <SkeletonWrapper>$00.00</SkeletonWrapper>
              </span>
            )}
          </span>
          <span className="text-10 text-xs uppercase leading-none">
            {Localization.Label.LAST_24_HOURS}
          </span>
        </div>
        <div
          className={cs(
            'bg-50 flex flex-1 flex-col gap-1 rounded-lg p-2.5 text-center',
            feeClassNames,
          )}
        >
          <span className="text-white-blue text-sm leading-none lg:text-base">
            {last7Days ? (
              `$${last7Days}`
            ) : (
              <span className="pb-1 text-xs">
                <SkeletonWrapper>$00.00</SkeletonWrapper>
              </span>
            )}
          </span>
          <span className="text-10 text-xs uppercase leading-none">
            {Localization.Label.LAST_7_DAYS}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccumulatedFees;
