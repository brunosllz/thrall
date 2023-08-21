import { UsersRepository } from '@modules/account/application/repositories/users-repository';
import { PrismaProjectsRepository } from '@modules/timeline/infra/prisma/repositories/prisma-projects-repository';
import { Module } from '@nestjs/common';

import { PrismaService } from '@infra/database/prisma.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaProjectsRepository,
    },
  ],
  exports: [PrismaService, UsersRepository],
})
export class PrismaDatabaseModule {}
