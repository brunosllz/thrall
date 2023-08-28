import { PrismaDatabaseModule as PrismaDatabaseNotificationModule } from '@modules/notification/infra/prisma/prisma-database.module';
import { PrismaDatabaseModule as PrismaDatabaseTimeLineModule } from '@modules/timeline/infra/prisma/prisma-database.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { OnAnswerCreated } from './on-answer-created';

@Module({
  imports: [
    PrismaDatabaseNotificationModule,
    PrismaDatabaseTimeLineModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [OnAnswerCreated],
})
export class HandlersModule {}
