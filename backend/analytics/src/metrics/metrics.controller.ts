import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Prisma } from '@xfai-labs/analytics-db';
import { parseJSON } from 'date-fns';
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('pools')
  getPoolMetric(
    @Query('page') page: number,
    @Query('search') search = '',
    @Query('orderby') orderby: keyof Prisma.PoolAnalyticOrderByWithRelationInput = 'tvl',
    @Query('order') order: Prisma.SortOrder = 'desc',
  ) {
    return this.metricsService.getPoolLatestMetrics({
      page: page,
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            symbol: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tokenAddress: {
              equals: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        [orderby]: order,
      },
    });
  }

  @Get('tvl')
  getTvlStats() {
    return this.metricsService.getTvlStats();
  }
  @Get('fees')
  getFeeStats(@Query('month') month?: string) {
    return this.metricsService.getFeeStats({
      month: month ? parseJSON(month) : new Date(),
    });
  }
  @Get('xfit')
  getXFitStats() {
    return this.metricsService.getXFitStats();
  }
}
