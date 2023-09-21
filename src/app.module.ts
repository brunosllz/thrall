import { envSchema } from '@common/infra/config/env';
import { InfraModule } from '@common/infra/infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ProjectManagementModule } from '@modules/project-management/project-management.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    InfraModule,
    ProjectManagementModule,
    NotificationModule,
  ],
})
export class AppModule {}
