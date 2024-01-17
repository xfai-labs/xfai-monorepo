import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobSchedulerModule } from '../cron/job-scheduler.module';
import { JobHandlerModule } from '../jobs/job-handler.module';
import { Xfai3ProviderModule } from '../xfai-provider/xfai-provider.service';
import { MetricsModule } from '../metrics/metrics.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '@xfai-labs/analytics-db';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { BackendConfig } from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [BackendConfig],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    JobHandlerModule,
    ConditionalModule.registerWhen(
      JobSchedulerModule,
      (env: NodeJS.ProcessEnv) => !env['DISABLE_JOBS'],
    ),
    Xfai3ProviderModule,
    PrismaModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
