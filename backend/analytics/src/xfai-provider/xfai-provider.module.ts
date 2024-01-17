import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Injectable, Logger } from '@nestjs/common';
import { Chains, Xfai } from '@xfai-labs/sdk';

@Injectable()
export class XfaiProviderService {
  private readonly logger = new Logger(XfaiProviderService.name);
  private readonly xfai: Xfai;
  constructor() {
    const chain = Chains[59144];

    const web3Provider = new StaticJsonRpcProvider({
      url: chain.rpcUrl,
      skipFetchSetup: true,
    });

    web3Provider.ready
      .then(() => {
        this.logger.log(`Web3 provider is ready`);
      })
      .catch((err) => {
        this.logger.error(`Web3 provider is not ready: ${err}`);
      });

    this.xfai = new Xfai(web3Provider, chain);
  }

  getXfai(): Xfai {
    return this.xfai;
  }
}
