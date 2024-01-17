import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import axios from 'axios';
import { TokenList } from '@uniswap/token-lists';
import { uniqBy } from 'lodash';
import { PrismaService } from '@xfai-labs/analytics-db';
import { XfaiProviderService } from '../xfai-provider/xfai-provider.module';
import { Xfai, isWrappedNativeToken } from '@xfai-labs/sdk';
@Injectable()
export class AppService {
  private xfai: Xfai;
  constructor(
    private prismService: PrismaService,
    xfai: XfaiProviderService,
    @InjectQueue('metadata') private metadata: Queue,
    @InjectQueue('metrics') private metrics: Queue,
  ) {
    this.xfai = xfai.getXfai();
  }

  async healthCheck() {
    try {
      await Promise.all([this.metadata.isReady(), this.metrics.isReady()]);
    } catch (e) {
      throw new HttpException('Service not ready', HttpStatus.SERVICE_UNAVAILABLE);
    }

    return {
      message: 'Welcome to xfai analytics!',
    };
  }

  async tokenUpdate() {
    const result = await this.metrics.add('token-update');
    return {
      message: `Token list update scheduled with job id: ${result.id}`,
    };
  }

  async tokenListUpdate() {
    const result = await this.metadata.add('token-list-update');
    return {
      message: `Token list update scheduled with job id: ${result.id}`,
    };
  }
  async fetchBlocks() {
    const result = await this.metadata.add('fetch-blocks');
    return {
      message: `Block fetching scheduled with job id: ${result.id}`,
    };
  }
  async fetchEthPrices() {
    const result = await this.metadata.add('fetch-eth-prices');
    return {
      message: `Eth price fetching scheduled with job id: ${result.id}`,
    };
  }

  async getTokenList(full = false) {
    const tokenList = await this.prismService.pool.findMany({
      select: {
        tokenAddress: true,
        decimals: true,
        symbol: true,
        name: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
    const tokenAddresses = tokenList.map((token) => token.tokenAddress.toLowerCase());

    const { data: allTokens } = await axios.get<TokenList>(
      'https://raw.githubusercontent.com/Consensys/linea-token-list/main/json/linea-mainnet-token-shortlist.json',
    );
    const tokens = allTokens.tokens
      .filter((token) => !isWrappedNativeToken(this.xfai, token))
      .concat([
        this.xfai.underlyingToken,
        {
          ...this.xfai.nativeToken,
          address: this.xfai.wrappedNativeToken.address,
        },
      ])
      .concat(
        tokenList.map(
          (t) =>
            ({
              chainId: allTokens.tokens[0].chainId,
              address: t.tokenAddress,
              name: t.name,
              symbol: t.symbol,
              decimals: t.decimals,
            }) as TokenList['tokens'][number],
        ),
      )
      .map((t) => ({
        ...t,
        tags: tokenAddresses.includes(t.address.toLowerCase()) ? [] : ['extended'],
      }));

    const uniqTokens = uniqBy(tokens, 'address');
    if (full) {
      return {
        type: 'LineaTokenList',
        tokenListId: 'https://analytics.xfai.com/api/tokens',
        name: 'Xfai Linea Mainnet Token List',
        createdAt: '2023-07-13',
        updatedAt: tokenList[tokenList.length - 1].timestamp.toISOString(),
        versions: [
          {
            major: 1,
            minor: uniqTokens.length,
            patch: 0,
          },
        ],
        tokens: uniqTokens.filter((t) => !isWrappedNativeToken(this.xfai, t)),
      };
    }
    return uniqTokens;
  }
}
