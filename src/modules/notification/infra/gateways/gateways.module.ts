import { Module } from '@nestjs/common';

import { UseCasesModule } from '../../application/use-cases/use-cases.module';
import { NotificationGateway } from './notification-gateway';

@Module({
  imports: [UseCasesModule],
  providers: [NotificationGateway],
})
export class GatewaysModule {}
