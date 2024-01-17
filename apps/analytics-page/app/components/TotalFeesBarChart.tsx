import Localization from '@analytics/localization';
import { FunctionComponent, HTMLProps, useEffect, useMemo, useState } from 'react';
import { Chart, ChartData } from '@analytics/components/Chart';
import cs from 'classnames';
import { FeeMetricResponse } from '@analytics/types/backend';
import { ButtonIcon, IconArrowLeft, IconArrowRight } from '@xfai-labs/ui-components';
import { useQuery } from '@tanstack/react-query';
import { addMonths, min, format, parseISO, endOfMonth, addDays } from 'date-fns';

const TotalValueLockedLineChart: FunctionComponent<
  HTMLProps<HTMLDivElement> & {
    fees: FeeMetricResponse;
    api_base_url: string;
  }
> = ({ fees, api_base_url, className, ...props }) => {
  const [monthDate, setMonthDate] = useState(new Date());
  const { data: monthlyFees, isLoading } = useQuery({
    queryKey: ['fees', monthDate.toISOString().split('T')[0], api_base_url, monthDate],
    queryFn: () =>
      fetch(`${api_base_url}/metrics/fees?month=${monthDate.toJSON()}`).then(
        (res) => res.json() as Promise<FeeMetricResponse>,
      ),
    initialData: fees,
  });

  const data: ChartData[] = useMemo(() => {
    const processedData = monthlyFees.data.map((day) => ({
      x: new Date(day.date).toLocaleDateString(),
      y: Number(day.fees),
      disabled: false,
    }));

    const lastDataDate = new Date(monthlyFees.data[monthlyFees.data.length - 1].date);

    const lastDayOfMonth = endOfMonth(lastDataDate);

    for (let day = addDays(lastDataDate, 1); day <= lastDayOfMonth; day = addDays(day, 1)) {
      const missingDate = day.toLocaleDateString();
      processedData.push({ x: missingDate, y: 0, disabled: true });
    }

    return processedData;
  }, [monthlyFees]);

  const today = {
    x: '',
    y: Number(monthlyFees.total),
  };

  const [currentFees, setFees] = useState<number>(today.y);
  const [date, setDate] = useState<string | number>(today.x);

  useEffect(() => {
    setFees(today.y);
    setDate(today.x);
  }, [today.x, today.y, data]);
  return (
    <div
      className={cs(
        'bg-60/50 border-60/20 dark:border-60 text-white-blue flex flex-col gap-2.5 rounded-lg p-2.5 md:p-5',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-start justify-between gap-3 p-2.5 sm:flex-row sm:gap-0 lg:px-5 lg:py-4">
        <div className="order-last flex flex-col gap-1.5 sm:order-first">
          <div className="flex flex-col gap-0 font-medium leading-none">
            <h2 className="text-5 text-sm">{Localization.Label.TOTAL_ACCUMULATED_FEES}</h2>
            <span className="text-white-blue text-3xl">{`$${currentFees.toLocaleString()}`}</span>
          </div>
          <span className="text-5 text-xs font-light">
            <span className="absolute">{date}</span>
          </span>
        </div>
        <div className="bg-60/50 border-60/20 dark:border-60 flex items-center gap-2.5 rounded-md p-1">
          <ButtonIcon
            size="xx-small"
            color="fill-5 hover:fill-white-blue"
            bgColor="bg-50 hover:bg-40"
            icon={IconArrowLeft}
            disabled={isLoading}
            onClick={() =>
              setMonthDate((current_date) => {
                const newDate = addMonths(current_date, -1);
                if (parseISO('2023-08-01') >= newDate) {
                  return current_date;
                }
                return newDate;
              })
            }
          />
          <span className="text-xsm text-10">{format(monthDate, 'MMM yyyy')}</span>
          <ButtonIcon
            size="xx-small"
            color="fill-5 hover:fill-white-blue"
            bgColor="bg-50 hover:bg-40"
            icon={IconArrowRight}
            disabled={isLoading}
            onClick={() =>
              setMonthDate((current_date) => {
                return min([new Date(), addMonths(current_date, 1)]);
              })
            }
          />
        </div>
      </div>
      <Chart.Bar
        data={data}
        setY={(y) => {
          setFees(y ?? today.y);
        }}
        setX={(date) => {
          setDate(date ?? today.x);
        }}
      />
    </div>
  );
};

export default TotalValueLockedLineChart;
