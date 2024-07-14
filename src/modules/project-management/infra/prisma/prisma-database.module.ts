import { PrismaService } from '@/core/infra/prisma/prisma.service';
import { ProjectsDAO } from '@modules/project-management/application/dao/projects-dao';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { Module } from '@nestjs/common';

import { PrismaProjectsDAO } from './dao/prisma-projects-dao';
import { PrismaProjectsRepository } from './repositories/prisma-projects-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },

    {
      provide: ProjectsDAO,
      useClass: PrismaProjectsDAO,
    },
  ],
  exports: [PrismaService, ProjectsRepository, ProjectsDAO],
})
export class PrismaDatabaseModule {}
