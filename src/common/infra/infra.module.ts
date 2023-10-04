import { envSchema } from '@common/infra/config/env';
import { LoggerModule } from '@common/infra/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EnvModule } from './config/env/env.module';
import { AuthModule } from './http/auth/auh.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot({
      global: true,
      delimiter: '-',
    }),
    LoggerModule,
  ],
})
export class InfraModule {}
