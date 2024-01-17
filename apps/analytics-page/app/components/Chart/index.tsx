import { ChartData } from './ChartData';
import { LineChart as Line } from './LineChart';
import { BarChart as Bar } from './BarChart';
import { RadialProgress } from './RadialProgress';

export const Chart = {
  Line,
  Bar,
  RadialProgress,
} as const;

export type { ChartData };
