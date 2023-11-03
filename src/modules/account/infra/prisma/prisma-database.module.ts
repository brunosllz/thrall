import { PrismaService } from '@common/infra/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { UsersDAO } from '../../application/dao/users-dao';
import { PrismaUsersDAO } from './dao/prisma-users-dao';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersDAO,
      useClass: PrismaUsersDAO,
    },
  ],
  exports: [PrismaService, UsersDAO],
})
export class PrismaDatabaseModule {}
