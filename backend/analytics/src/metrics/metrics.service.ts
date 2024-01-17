import { Injectable } from '@nestjs/common';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import {
  PrismaService,
  Prisma,
  PoolAnalytic,
  TVLStats,
  FeeStats,
  XFitStats,
} from '@xfai-labs/analytics-db';
import { endOfMonth, startOfMonth } from 'date-fns';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getPoolLatestMetrics({
    where,
    orderBy,
    page = 1,
    perPage = 10,
  }: {
    where?: Prisma.PoolAnalyticWhereInput;
    orderBy?: Prisma.PoolAnalyticOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatorTypes.PaginatedResult<PoolAnalytic>> {
    return paginate(
      this.prisma.poolAnalytic,
      {
        where,
        orderBy: [orderBy],
      },
      {
        page,
        perPage,
      },
    );
  }
  async getTvlStats(): Promise<TVLStats[]> {
    return this.prisma.tVLStats.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  }
  async getXFitStats(): Promise<XFitStats> {
    return this.prisma.xFitStats.findFirstOrThrow();
  }
  async getFeeStats({ month }: { month: Date }): Promise<{
    total: string;
    data: FeeStats[];
  }> {
    return {
      total: await this.prisma.poolAnalytic
        .aggregate({
          where: {
            tvl: {
              gt: 50,
            },
          },
          _sum: {
            fees: true,
          },
        })
        .then((r) => String(r._sum.fees ?? 0)),
      data: await this.prisma.feeStats.findMany({
        where: {
          date: {
            gte: startOfMonth(month),
            lte: endOfMonth(month),
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
    };
  }
}
