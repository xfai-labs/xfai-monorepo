import { Module } from '@nestjs/common';
import { XfaiProviderService } from './xfai-provider.module';

@Module({
  providers: [XfaiProviderService],
  exports: [XfaiProviderService],
})
export class Xfai3ProviderModule {}
