import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { BackendConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, globalPrefix } = app.get(ConfigService<BackendConfig, true>).get('server');

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: '*',
  });
  app.enableShutdownHooks();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
