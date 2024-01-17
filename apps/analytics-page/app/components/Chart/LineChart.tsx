import { FunctionComponent, ReactElement, useRef, useState } from 'react';
import { ResponsiveContainer, LineChart as Chart, Line, Area, Tooltip } from 'recharts';

export type LineChartData = { x: string | number; y: number };

type Props = {
  data: LineChartData[];
  y?: number;
  setY?: (y: number | undefined) => void;
  x?: string | number;
  setX?: (x: string | number | undefined) => void;
  lineClassName?: string;
  activeDotClassName?: string;
};

const Cursor = (props) => {
  return <rect width={1} height="100%" fill="url(#verticalGradient)" x={props.points[0].x} y={0} />;
};

export const LineChart: FunctionComponent<Props> = ({
  data,
  y,
  setY,
  x,
  setX,
  lineClassName = 'stroke-cyan',
  activeDotClassName = 'stroke-cyan fill-white',
}) => {
  const chart = useRef<ReactElement>();
  const area = useRef<Area>();

  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number>(0);
  const chartHeight = chart.current?.props.height ?? 200;
  const areaPoints = area.current?.props.points;
  const activePointY = areaPoints?.[activeTooltipIndex].y ?? 100;
  const cursorOffsetPercentage = (activePointY * 100) / chartHeight;

  return (
    <div className="relative h-[240px]">
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between px-2.5 pb-2.5 pt-8">
        {[...new Array(5)].map((_, index) => (
          <span
            key={index}
            className="via-white-black h-px bg-gradient-to-r from-white/0 from-[-20%] via-50% to-white/0 to-[120%] opacity-[0.07]"
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
            setActiveTooltipIndex(e.activeTooltipIndex ?? 0);

            if (!e.activePayload) return;
            setX && setX(e.activePayload[0].payload.x);
            setY && setY(e.activePayload[0].payload.y);
          }}
          onMouseLeave={() => {
            setX && setX(undefined);
            setY && setY(undefined);
          }}
          margin={{
            top: 30,
            right: 10,
            left: 10,
            bottom: 10,
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ref={chart}
        >
          <defs>
            <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset={`${cursorOffsetPercentage}%`} stopColor="white" stopOpacity={0.25} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <Tooltip cursor={<Cursor />} contentStyle={{ display: 'none' }} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="inherit"
            strokeWidth={3}
            className={lineClassName}
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: 'inherit',
              fill: 'inherit',
              className: activeDotClassName,
            }}
            strokeLinecap="round"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={area}
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};
