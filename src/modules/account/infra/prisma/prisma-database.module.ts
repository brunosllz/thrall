import { PrismaService } from '@common/infra/prisma/prisma.service';
import { UsersRepository } from '@modules/account/application/repositories/users-repository';
import { PrismaProjectsRepository } from '@modules/timeline/infra/prisma/repositories/prisma-projects-repository';
import { Module } from '@nestjs/common';

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
