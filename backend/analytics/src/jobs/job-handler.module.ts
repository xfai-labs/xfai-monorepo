import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MetadataJobProcessor } from './metadata.processor';
import { Xfai3ProviderModule } from '../xfai-provider/xfai-provider.service';
import { MetricsJobProcessor } from './metrics.processor';
import { PrismaModule } from '@xfai-labs/analytics-db';
import { BackendConfig } from '../config/configuration';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    Xfai3ProviderModule,
    PrismaModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<BackendConfig, true>) => ({
        redis: config.get('redis'),
      }),
    }),
    BullModule.registerQueue({
      name: 'metadata',
    }),
    BullModule.registerQueue({
      name: 'metrics',
    }),
  ],
  providers: [MetadataJobProcessor, MetricsJobProcessor],
  exports: [BullModule],
})
export class JobHandlerModule {}
