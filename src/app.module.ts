import { CommonInfraModule } from '@common/infra/common-infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { TimeLineModule } from '@modules/timeline/timeline.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CommonInfraModule, TimeLineModule, NotificationModule],
})
export class AppModule {}
