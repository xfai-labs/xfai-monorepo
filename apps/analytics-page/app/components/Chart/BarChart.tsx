import { FunctionComponent, useState } from 'react';
import { ResponsiveContainer, BarChart as Chart, Bar } from 'recharts';
import { ChartData } from './ChartData';

type Props = {
  data: ChartData[];
  y?: number;
  setY?: (y: number | undefined) => void;
  x?: string | number;
  setX?: (x: string | number | undefined) => void;
  barClassName?: string;
  barInactiveClassName?: string;
  barDisabledClassName?: string;
};

type CustomBarProps = {
  index: number;
  activeIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
  inactiveClassName?: string;
};

const CustomBar: FunctionComponent<CustomBarProps> = ({
  index,
  activeIndex,
  x,
  y,
  width,
  height,
  className,
  inactiveClassName,
}) => {
  const classNames =
    activeIndex !== undefined ? (activeIndex === index ? className : inactiveClassName) : className;

  return (
    <g>
      <rect
        x={x}
        y={y - 8}
        fill="inherit"
        width={width}
        height={height + 8}
        rx={4}
        className={classNames}
      />
    </g>
  );
};

export const BarChart: FunctionComponent<Props> = ({
  data,
  setY,
  setX,
  barClassName = 'fill-magenta border border-teal-400 b-2',
  barInactiveClassName = 'fill-30',
  barDisabledClassName = 'fill-40',
}) => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | undefined>();

  return (
    <div className="relative h-[240px]">
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between px-2.5 pb-2.5 pt-8">
        {[...new Array(5)].map((_, index) => (
          <span
            key={index}
            className="via-white-black h-px bg-gradient-to-r from-white/0 from-[-20%] via-50% to-white/0 to-[120%] opacity-[0.07] last:opacity-0"
          />
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <Chart
          width={500}
          height={240}
          data={data}
          onMouseMove={(e) => {
            if (!e) return;
            setActiveTooltipIndex(e.activeTooltipIndex);

            if (!e.activePayload) return;
            setX && setX(e.activePayload[0].payload.x);
            setY && setY(e.activePayload[0].payload.y);
          }}
          onMouseLeave={() => {
            setActiveTooltipIndex(undefined);
            setX && setX(undefined);
            setY && setY(undefined);
          }}
          margin={{
            top: 30,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <Bar
            type="monotone"
            dataKey="y"
            shape={(props) => (
              <CustomBar
                index={props.index}
                activeIndex={activeTooltipIndex}
                height={props.height}
                width={Math.min(props.width, 20)}
                x={props.x}
                y={props.y}
                className={props.disabled ? barDisabledClassName : barClassName}
                inactiveClassName={props.disabled ? barDisabledClassName : barInactiveClassName}
              />
            )}
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};
