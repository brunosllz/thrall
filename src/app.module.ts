import { InfraModule } from '@common/infra/infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ProjectManagementModule } from '@modules/project-management/project-management.module';
import { Module } from '@nestjs/common';

import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    InfraModule,
    ProjectManagementModule,
    NotificationModule,
    AccountModule,
  ],
})
export class AppModule {}
