import Localization from '@analytics/localization';
import { FunctionComponent, HTMLProps, useEffect, useMemo, useState } from 'react';
import { Chart, ChartData } from './Chart';
import cs from 'classnames';
import { TVLMetricResponse } from '@analytics/types/backend';
const TotalValueLockedLineChart: FunctionComponent<
  HTMLProps<HTMLDivElement> & {
    tvls: TVLMetricResponse;
  }
> = ({ className, tvls, ...props }) => {
  const data: ChartData[] = useMemo(
    () =>
      tvls.map((day) => ({
        x: new Date(day.date).toLocaleDateString(),
        y: Number(day.tvl),
      })),
    [tvls],
  );

  const today = data[data.length - 1];

  const [tvl, setTVL] = useState<number>(today.y);
  const [date, setDate] = useState<string | number>(today.x);

  useEffect(() => {
    setTVL(today.y);
    setDate(today.x);
  }, [today.x, today.y]);
  return (
    <div
      className={cs(
        'bg-60/50 border-60/20 dark:border-60 text-white-blue flex flex-col gap-2.5 rounded-lg p-2.5 md:p-5',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5 p-2.5 lg:px-5 lg:py-4">
        <div className="flex flex-col gap-0 font-medium leading-none">
          <h2 className="text-5 text-sm">{Localization.Label.TOTAL_VALUE_LOCKED}</h2>
          <span className="text-white-blue text-3xl">{`$${tvl.toLocaleString()}`}</span>
        </div>
        <span className="text-5 text-xs font-light">
          <span className="absolute">{date}</span>
        </span>
      </div>
      <Chart.Line
        data={data}
        y={tvl}
        setY={(y) => {
          setTVL(y ?? today.y);
        }}
        x={date}
        setX={(date) => {
          setDate(date ?? today.x);
        }}
      />
    </div>
  );
};

export default TotalValueLockedLineChart;
