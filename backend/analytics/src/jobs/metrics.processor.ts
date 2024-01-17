import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { XfaiProviderService } from '../xfai-provider/xfai-provider.module';
import {
  Token,
  Xfai,
  getINFT,
  getPoolFromToken,
  getPoolState,
  getToken,
  isWrappedNativeToken,
  PoolState,
} from '@xfai-labs/sdk';
import { PrismaService } from '@xfai-labs/analytics-db';
import { Job } from 'bull';
import { BigNumber, utils } from 'ethers';
import { isError } from 'lodash';

@Processor('metrics')
export class MetricsJobProcessor {
  private readonly logger = new Logger(MetricsJobProcessor.name);
  private xfai: Xfai;

  constructor(
    web3Service: XfaiProviderService,
    private prismaService: PrismaService,
  ) {
    this.xfai = web3Service.getXfai();
  }
  @Process('token-update')
  async fetchTokenMetrics() {
    const [metricsToFetch] = await Promise.all([
      this.prismaService.metricsToFetch.findMany({
        take: 500,
        orderBy: {
          timestamp: 'desc',
        },
      }),
    ]);
    this.logger.log(`Fetching ${metricsToFetch.length} metrics`);

    for (const { tokenAddress, blockNumber, timestamp } of metricsToFetch) {
      try {
        const blockTag = Number(blockNumber);
        this.logger.verbose(
          `[token:${tokenAddress}] Fetching metrics at block ${blockTag} (${timestamp.toISOString()})`,
        );

        const tokenContract = getToken(this.xfai, Token(tokenAddress));

        let tokenState: PoolState, feeBalance, harvestedBalance;
        if (!isWrappedNativeToken(this.xfai, Token(tokenAddress))) {
          const pool = getPoolFromToken(this.xfai, Token(tokenAddress));

          [tokenState, feeBalance, harvestedBalance] = await Promise.all([
            getPoolState(this.xfai, pool, {
              blockTag: blockTag,
            }),
            tokenContract.balanceOf(this.xfai.inftAddress, {
              blockTag: blockTag,
            }),
            getINFT(this.xfai).harvestedBalance(tokenAddress, {
              blockTag: blockTag,
            }),
          ]);
        } else {
          [feeBalance, harvestedBalance] = await Promise.all([
            tokenContract.balanceOf(this.xfai.inftAddress, {
              blockTag: blockTag,
            }),
            getINFT(this.xfai).harvestedBalance(tokenAddress, {
              blockTag: blockTag,
            }),
          ]);
          tokenState = {
            reserve: BigNumber.from(1),
            ethReserve: BigNumber.from(1),
          };
        }

        this.logger.verbose(
          `[token:${tokenAddress}] ethBalance: ${utils.formatEther(
            tokenState.ethReserve,
          )}; feeBalance: ${feeBalance.toString()}`,
        );
        const feesEarned = feeBalance.add(harvestedBalance);
        await this.prismaService.poolMetric.create({
          data: {
            tokenAddress: tokenAddress,
            blockNumber: blockTag,
            ethBalance: tokenState.ethReserve.toString(),
            tokenBalance: tokenState.reserve.toString(),
            feesEarned: feesEarned.toString(),
            timestamp: timestamp,
          },
        });
      } catch (error) {
        this.logger.error(
          `[token:${tokenAddress}] Failed to fetch metrics at time ${timestamp.toISOString()}: ${
            isError(error) ? error.message : error
          }`,
        );
      }
    }
  }

  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
}
