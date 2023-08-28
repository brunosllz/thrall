import { Module } from '@nestjs/common';

import { UseCasesModule } from '../use-cases/use-cases.module';
import { NotificationsQueue } from './notifications-queue';

@Module({
  imports: [UseCasesModule],
  providers: [NotificationsQueue],
})
export class QueuesModule {}
