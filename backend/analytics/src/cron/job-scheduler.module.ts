import { Module } from '@nestjs/common';
import { JobScheduler } from './job-scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JobHandlerModule } from '../jobs/job-handler.module';
import { Xfai3ProviderModule } from '../xfai-provider/xfai-provider.service';
import { PrismaModule } from '@xfai-labs/analytics-db';

@Module({
  imports: [JobHandlerModule, PrismaModule, Xfai3ProviderModule, ScheduleModule.forRoot()],
  providers: [JobScheduler],
})
export class JobSchedulerModule {}
