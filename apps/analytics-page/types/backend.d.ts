import { FeeStats, PoolAnalytic, TVLStats, XFitStats } from '@xfai-labs/analytics-db';

export type PoolAnalyticsResponse = {
  [key in keyof PoolAnalytic]: string;
};

export type TVLMetricResponse = {
  [key in keyof TVLStats]: string;
}[];

export type FeeMetricResponse = {
  total: string;
  data: {
    [key in keyof FeeStats]: string;
  }[];
};

export type XFitStatsResponse = {
  [key in keyof XFitStats]: string;
};
