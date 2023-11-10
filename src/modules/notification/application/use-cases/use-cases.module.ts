import { PrismaDatabaseModule } from '@modules/notification/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { CountUnreadNotificationsByUserIdUseCase } from './queries/count-unread-notifications-by-user-id';
import { FetchNotificationsByUserIdUseCase } from './queries/fetch-notifications-by-user-id';
import { ReadNotificationUseCase } from './read-notification';
import { SendNotificationUseCase } from './send-notification';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [
    SendNotificationUseCase,
    ReadNotificationUseCase,
    FetchNotificationsByUserIdUseCase,
    CountUnreadNotificationsByUserIdUseCase,
  ],
  exports: [
    SendNotificationUseCase,
    ReadNotificationUseCase,
    FetchNotificationsByUserIdUseCase,
    CountUnreadNotificationsByUserIdUseCase,
  ],
})
export class UseCasesModule {}
