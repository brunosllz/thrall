import { Module } from '@nestjs/common';

import { UseCasesModule } from '../../application/use-cases/use-cases.module';
import { NotificationsController } from './controllers/notifications.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [NotificationsController],
})
export class HttpModule {}
