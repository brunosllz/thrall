import { PrismaDatabaseModule as PrismaDatabaseNotificationsModule } from '@modules/notification/infra/prisma/prisma-database.module';
import { PrismaDatabaseModule as PrismaDatabaseProjectsModule } from '@modules/project-management/infra/prisma/prisma-database.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { UseCasesModule } from '../use-cases/use-cases.module';
import { OnAnswerCreated } from './on-answer-created';
import { OnNotificationRead } from './on-notification-read';

@Module({
  imports: [
    PrismaDatabaseNotificationsModule,
    PrismaDatabaseProjectsModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
    UseCasesModule,
  ],
  providers: [OnNotificationRead, OnAnswerCreated],
})
export class HandlersModule {}
