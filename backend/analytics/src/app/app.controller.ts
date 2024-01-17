import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return this.appService.healthCheck();
  }

  @Get('/token-update')
  tokenUpdate() {
    return this.appService.tokenUpdate();
  }
  @Get('/list-update')
  tokenList() {
    return this.appService.tokenListUpdate();
  }
  @Get('/fetch-blocks')
  fetchBlocks() {
    return this.appService.fetchBlocks();
  }
  @Get('/fetch-eth-prices')
  fetchEthPrices() {
    return this.appService.fetchEthPrices();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(20 * 1000)
  @Get('/token-list')
  getTokenList() {
    return this.appService.getTokenList(false);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(20 * 1000)
  @Get('/tokens')
  getTokens() {
    return this.appService.getTokenList(true);
  }
}
