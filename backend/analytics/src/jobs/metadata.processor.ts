import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { XfaiProviderService } from '../xfai-provider/xfai-provider.module';
import {
  Pool,
  Token,
  Xfai,
  getFactory,
  getINFTState,
  getPool,
  getTokenDetails,
} from '@xfai-labs/sdk';
import { addHours, fromUnixTime, getUnixTime, startOfHour } from 'date-fns';
import axios from 'axios';
import { PrismaService } from '@xfai-labs/analytics-db';
import { BigNumber } from 'ethers';
import { Job } from 'bull';

const fetchClosestBlock = async (time: Date) => {
  const chain = 'linea';
  const { data: block } = await axios.get<{
    height: bigint;
    timestamp: number;
  }>(`https://coins.llama.fi/block/${chain}/${getUnixTime(time)}`);
  return block;
};

@Processor('metadata')
export class MetadataJobProcessor {
  private readonly logger = new Logger(MetadataJobProcessor.name);
  private xfai: Xfai;

  constructor(
    web3Service: XfaiProviderService,
    private prismaService: PrismaService,
  ) {
    this.xfai = web3Service.getXfai();
  }
  @Process('token-list-update')
  async updateTokenList() {
    this.logger.log(`Updating token list`);
    const blockNumber = await this.xfai.provider.getBlockNumber();
    const numberOfPools = (
      await getFactory(this.xfai).allPoolsLength({
        blockTag: blockNumber,
      })
    ).toNumber();
    this.logger.log(`Current number of pools in block ${blockNumber} is: ${numberOfPools}`);

    const allPools = await this.prismaService.pool.findMany({
      select: {
        id: true,
        createdBlockNumber: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (numberOfPools <= allPools.length) {
      this.logger.log(`No new pools found`);
      return;
    }

    let tokenAddress = '';

    const binarySearchForBlock = async (
      xfai: Xfai,
      poolAddress: string,
      startBlock: number,
      endBlock: number,
      iteration = 0,
    ): Promise<{
      blockNumber: number;
      address: string;
    }> => {
      // we know that pool exists at endBlock
      iteration++;
      if (startBlock > endBlock) {
        this.logger.error('Start block is greater than end block');
        throw new Error('Start block is greater than end block');
      }

      this.logger.debug(
        `[iter:${iteration}] Searching for pool ${poolAddress} between ${startBlock} and ${endBlock}`,
      );
      const midBlock = Math.floor((startBlock + endBlock) / 2);

      this.logger.debug(`[iter:${iteration}] Mid block is ${midBlock}`);

      let poolExists: false | string = false;
      try {
        poolExists = await getPool(xfai, Pool(poolAddress)).poolToken({
          blockTag: midBlock,
        });
        tokenAddress = poolExists;
      } catch (e) {
        this.logger.debug(
          `[iter:${iteration}] Pool ${poolAddress} does not exist at block ${midBlock}`,
        );
      }

      //if pool exists at midBlock go left, else go right
      if (poolExists) {
        this.logger.debug(
          `[iter:${iteration}] Pool ${poolAddress} exists at block ${midBlock} going left`,
        );
        return binarySearchForBlock(xfai, poolAddress, startBlock, midBlock, iteration);
      } else {
        if (midBlock === endBlock - 1) {
          return {
            blockNumber: endBlock,
            address: tokenAddress,
          };
        }
        this.logger.debug(
          `[iter:${iteration}] Pool ${poolAddress} doesn't exists at block ${midBlock} going right`,
        );
        return binarySearchForBlock(xfai, poolAddress, midBlock, endBlock, iteration);
      }
    };

    const missingPools = [...new Array(numberOfPools).keys()].filter(
      (i) => !allPools.find((p) => p.id == i),
    );

    // Process new pools
    let lastPoolCreatedAtBlock;
    for (const missingPool of missingPools) {
      this.logger.log(`Processing pool ${missingPool}`);
      // Binary search between lastPoolCreatedAtBlock and blockNumber
      const poolAddress = await getFactory(this.xfai).allPools(missingPool, {
        blockTag: blockNumber,
      });
      const poolCreationBlock = await binarySearchForBlock(
        this.xfai,
        poolAddress,
        (lastPoolCreatedAtBlock ??
          Number(allPools.reverse().find((p) => p.id <= missingPool)?.createdBlockNumber ?? 1)) - 1,
        blockNumber,
      );
      this.logger.log(`Pool ${poolAddress} was created at block ${poolCreationBlock.blockNumber}`);
      const timestamp = await this.xfai.provider
        .getBlock(poolCreationBlock.blockNumber)
        .then((b) => b.timestamp);
      const tokenDetails = await getTokenDetails(this.xfai, Token(tokenAddress));

      await this.prismaService.pool.create({
        data: {
          id: missingPool,
          createdBlockNumber: poolCreationBlock.blockNumber,
          tokenAddress: poolCreationBlock.address,
          decimals: tokenDetails.decimals,
          name: tokenDetails.name ?? 'Unknown',
          symbol: tokenDetails.symbol ?? 'Unknown',
          timestamp: fromUnixTime(timestamp),
        },
      });

      lastPoolCreatedAtBlock = poolCreationBlock.blockNumber;

      this.logger.log(`Pool ${poolAddress} was created at block ${poolCreationBlock.blockNumber}`);
    }
  }

  @Process('fetch-blocks')
  async fetchBlockNumbers() {
    let lastBlock = await this.prismaService.blockTimestamp.findFirst({
      orderBy: {
        blockNumber: 'desc',
      },
    });
    if (!lastBlock) {
      const minBlock = await this.prismaService.pool.findFirst({
        orderBy: {
          createdBlockNumber: 'asc',
        },
      });
      if (!minBlock) {
        this.logger.log('No Pools are created yet');
        return;
      }
      const minTimestamp = addHours(startOfHour(minBlock.timestamp), 1);
      this.logger.log(`Fetching blocks from ${minTimestamp} onwards`);
      const closestBlock = await fetchClosestBlock(minTimestamp);
      lastBlock = {
        blockNumber: closestBlock.height,
        timestamp: minTimestamp,
      };
      await this.prismaService.blockTimestamp.create({
        data: lastBlock,
      });
      this.logger.log(`Created first block ${lastBlock.blockNumber} at ${lastBlock.timestamp}`);
    }
    let nextBlockTime = addHours(lastBlock.timestamp, 1);
    while (nextBlockTime <= new Date()) {
      try {
        const closestBlock = await fetchClosestBlock(nextBlockTime);
        this.logger.log(`Fetched block ${closestBlock.height} at ${nextBlockTime}`);
        await this.prismaService.blockTimestamp.create({
          data: {
            blockNumber: closestBlock.height,
            timestamp: nextBlockTime,
          },
        });
      } catch (e) {
        this.logger.error(e);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      nextBlockTime = addHours(nextBlockTime, 1);
    }
  }
  @Process('fetch-eth-prices')
  async fetchEthPrices() {
    const pricesToFetch = await this.prismaService.ethpricetofetch.findMany({
      take: 1000,
      orderBy: {
        blockNumber: 'desc',
      },
    });
    this.logger.log(`Fetching ${pricesToFetch.length} eth and nft prices`);

    for (const { blockNumber, timestamp } of pricesToFetch) {
      this.logger.log(
        `Fetching eth and nft prices at block:${blockNumber} timestamp: ${getUnixTime(timestamp)}`,
      );
      const [usdPrice, nftState] = await Promise.all([
        axios
          .get<{
            coins: {
              'linea:0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f': {
                price: number;
              };
            };
          }>(
            `https://coins.llama.fi/prices/historical/${getUnixTime(
              timestamp,
            )}/linea:0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f`,
            {
              headers: {
                'User-Agent': 'Xfai',
              },
            },
          )
          .then((r) => r.data)
          .then((d) => d.coins['linea:0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f'].price)
          .then((price) => BigNumber.from(Math.floor(price * 1e6))),
        getINFTState(this.xfai, { blockTag: Number(blockNumber) }),
      ]);
      this.logger.log(
        `Fetched for eth and nft prices at block:${blockNumber} timestamp: ${getUnixTime(
          timestamp,
        )}`,
      );
      await this.prismaService.ethPrice.create({
        data: {
          blockNumber,
          usdPrice: usdPrice.toString(),
          totalLocked: nftState.initialReserve
            .sub(
              BigNumber.from(10)
                .pow(18 + 7)
                .mul(6),
            )
            .add(nftState.reserve)
            .toString(),
        },
      });
    }
    this.logger.log(`Fetched ${pricesToFetch.length} xf metrics`);
  }
  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
}
