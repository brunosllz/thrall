import { PrismaService } from '@common/infra/prisma/prisma.service';
import { NotificationsRepository } from '@modules/notification/application/repositories/notifications-repository';
import { Module } from '@nestjs/common';

import { PrismaNotificationsRepository } from './repositories/notifications-prisma-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [PrismaService, NotificationsRepository],
})
export class PrismaDatabaseModule {}
