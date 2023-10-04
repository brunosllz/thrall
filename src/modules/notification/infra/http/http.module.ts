import { Module } from '@nestjs/common';

import { UseCasesModule } from '../../application/use-cases/use-cases.module';
import { NotificationController } from './controllers/notifications.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [NotificationController],
})
export class HttpModule {}
