import { Module } from '@nestjs/common';

import { HandlersModule } from './application/handlers/handlers.module';
import { QueuesModule } from './application/queues/queues.module';
import { GatewaysModule } from './infra/gateways/gateways.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [GatewaysModule, HandlersModule, QueuesModule, HttpModule],
})
export class NotificationModule {}
