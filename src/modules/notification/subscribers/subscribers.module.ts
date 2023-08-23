import { PrismaDatabaseModule as PrismaDatabaseTimeLineModule } from '@modules/timeline/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { UseCasesModule } from '../application/use-cases/use-cases.module';
import { PrismaDatabaseModule as PrismaDatabaseNotificationModule } from '../infra/prisma/prisma-database.module';
import { OnAnswerCreated } from './on-answer-created';

@Module({
  imports: [
    PrismaDatabaseNotificationModule,
    PrismaDatabaseTimeLineModule,
    UseCasesModule,
  ],
  providers: [OnAnswerCreated],
})
export class SubscribersModule {}
