import { FunctionComponent, useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

type Props = {
  percentage: number;
  label?: string;
  size?: number;
  thickness?: number;
  trackColorClassName?: string;
};

export const RadialProgress: FunctionComponent<Props> = ({
  percentage,
  label,
  size = 190,
  thickness = 16,
  trackColorClassName = 'fill-white-black/5',
}) => {
  const [isServerSide, setIsServerSide] = useState(true);

  useEffect(() => {
    setIsServerSide(false);
  }, [setIsServerSide]);

  if (isServerSide) {
    return null;
  }

  return (
    <div className="relative">
      <RadialBarChart
        id="radial-progress"
        width={size}
        height={size}
        innerRadius={size / 2 - thickness}
        outerRadius={size / 2}
        barSize={thickness}
        data={[{ y: percentage }]}
        startAngle={90}
        endAngle={-270}
        className={trackColorClassName}
      >
        <defs>
          <linearGradient
            id="progressGradient"
            x1="-54.6656"
            y1="103"
            x2="277.228"
            y2="103"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF0098"></stop>
            <stop offset="1" stop-color="#33CBCB"></stop>
          </linearGradient>
        </defs>
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
          opacity="0.1"
        />
        <RadialBar
          background={{ fill: 'inherit' }}
          dataKey="y"
          cornerRadius={size / 2}
          fill="url(#progressGradient)"
        />
      </RadialBarChart>
      <div
        className="absolute flex flex-col items-center justify-center gap-1 p-[18%] text-center text-inherit lg:gap-2"
        style={{ inset: thickness }}
      >
        <span className="pt-2 text-4xl font-light lg:text-5xl">{`${Math.round(percentage)}%`}</span>
        {label && (
          <span className="break-after-all whitespace-break-spaces break-words text-xs uppercase opacity-80">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
