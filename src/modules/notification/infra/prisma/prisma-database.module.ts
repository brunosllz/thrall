import { PrismaService } from '@common/infra/prisma/prisma.service';
import { NotificationsRepository } from '@modules/notification/application/repositories/notifications-repository';
import { Module } from '@nestjs/common';

import { NotificationsDAO } from '../../application/dao/notifications-dao';
import { PrismaNotificationsDAO } from './dao/prisma-notifications-dao';
import { PrismaNotificationsRepository } from './repositories/prisma-notifications-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: NotificationsDAO,
      useClass: PrismaNotificationsDAO,
    },
  ],
  exports: [PrismaService, NotificationsRepository, NotificationsDAO],
})
export class PrismaDatabaseModule {}
