import { InfraModule } from '@common/infra/infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { TimeLineModule } from '@modules/timeline/timeline.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfraModule, TimeLineModule, NotificationModule],
})
export class AppModule {}
