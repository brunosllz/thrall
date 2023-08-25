import { CommonInfraModule } from '@common/infra/common-infra.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { TimeLineModule } from '@modules/timeline/timeline.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CommonInfraModule,
    TimeLineModule,
    NotificationModule,
  ],
})
export class AppModule {}
