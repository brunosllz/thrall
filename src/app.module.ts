import { InfraModule } from '@common/infra/infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ProjectManagementModule } from '@modules/project-management/project-management.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfraModule, ProjectManagementModule, NotificationModule],
})
export class AppModule {}
