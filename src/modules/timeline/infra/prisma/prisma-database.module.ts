import { PrismaService } from '@common/infra/prisma/prisma.service';
import { ProjectsRepository } from '@modules/timeline/application/repositories/projects-repository';
import { RolesRepository } from '@modules/timeline/application/repositories/roles-repository';
import { Module } from '@nestjs/common';

import { PrismaProjectsRepository } from './repositories/prisma-projects-repository';
import { PrismaRolesRepository } from './repositories/prisma-roles-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: RolesRepository,
      useClass: PrismaRolesRepository,
    },
  ],
  exports: [PrismaService, ProjectsRepository, RolesRepository],
})
export class PrismaDatabaseModule {}
