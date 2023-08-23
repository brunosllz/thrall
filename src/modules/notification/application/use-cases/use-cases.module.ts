import { PrismaDatabaseModule } from '@modules/notification/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { ReadNotificationUseCase } from './read-notification';
import { SendNotificationUseCase } from './send-notification';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [SendNotificationUseCase, ReadNotificationUseCase],
  exports: [SendNotificationUseCase, ReadNotificationUseCase],
})
export class UseCasesModule {}
