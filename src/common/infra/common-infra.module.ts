import { LoggerModule } from '@common/infra/logger/logger.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { JWTAuthGuard } from './http/auth/jwt-auth-guard';
import { JwtStrategy } from './http/auth/jwt.strategy';

@Module({
  imports: [LoggerModule],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
})
export class CommonInfraModule {}
