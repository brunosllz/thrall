import { LoggerService } from '@common/infra/logger/logger.service';
import { env } from '@config/env';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const LoggerServiceInstance = app.get(LoggerService);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(LoggerServiceInstance);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(env.PORT, () => {
    LoggerServiceInstance.log(`Server is running on port ${env.PORT}`);
  });
}
bootstrap();
