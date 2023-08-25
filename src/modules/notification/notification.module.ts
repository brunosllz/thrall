import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { HandlersModule } from './application/handlers/handlers.module';
import { QueuesModule } from './application/queues/queues.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    HandlersModule,
    QueuesModule,
  ],
})
export class NotificationModule {}
