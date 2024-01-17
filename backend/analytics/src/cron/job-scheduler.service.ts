import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
@Injectable()
export class JobScheduler {
  private readonly logger = new Logger(JobScheduler.name);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectQueue('metadata') private metadata: Queue,
    @InjectQueue('metrics') private metrics: Queue,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduleTokenListUpdate() {
    this.logger.log('Scheduling token list update');
    const result = await this.metadata.add('token-list-update');
    this.logger.log(`Token list update scheduled with job id: ${result.id}`);
  }

  @Cron('1 0-23/1 * * *')
  async fetchBlockNumbers() {
    this.logger.log('Scheduling block number fetching');
    await this.metadata.add('fetch-blocks');
  }
  @Cron('3 0-23/1 * * *')
  async fetchPrices() {
    this.logger.log('Scheduling eth price fetching');
    await this.metadata.add('fetch-eth-prices');
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  async fetchPoolMetrics() {
    this.logger.log('Scheduling pool metrics fetching');
    await this.metrics.add('token-update');
  }
}
