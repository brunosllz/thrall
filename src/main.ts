import { LoggerService } from '@common/infra/logger/logger.service';
import { env } from '@config/env';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const LoggerServiceInstance = app.get(LoggerService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(LoggerServiceInstance);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2003: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  await app.listen(env.PORT, () => {
    LoggerServiceInstance.log(`Server is running on port ${env.PORT}`);
  });
}
bootstrap();
