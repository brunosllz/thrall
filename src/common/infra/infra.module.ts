import { LoggerModule } from '@common/infra/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { AuthModule } from './http/auth/auh.module';

@Module({
  imports: [
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    LoggerModule,
  ],
})
export class InfraModule {}
