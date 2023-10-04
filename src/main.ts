import { Env } from '@common/infra/config/env';
import { LoggerService } from '@common/infra/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggerService = app.get(LoggerService);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT', { infer: true });

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
  });
  app.setGlobalPrefix('api/v1');
  app.useLogger(loggerService);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  /** DISABLE PRISMA EXCEPTION FILTER */
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(
  //   new PrismaClientExceptionFilter(httpAdapter, {
  //     P2003: HttpStatus.UNPROCESSABLE_ENTITY,
  //   }),
  // );

  await app.listen(port, () => {
    loggerService.log(`Server is running on port ${port}`);
  });
}
bootstrap();
