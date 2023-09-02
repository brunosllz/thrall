import { PrismaService } from '@common/infra/prisma/prisma.service';
import { AnswerCommentsRepository } from '@modules/project-management/application/repositories/answer-comments-repository';
import { AnswersRepository } from '@modules/project-management/application/repositories/answers-repository';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { RolesRepository } from '@modules/project-management/application/repositories/roles-repository';
import { Module } from '@nestjs/common';

import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository';
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
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
  ],
  exports: [
    PrismaService,
    ProjectsRepository,
    RolesRepository,
    AnswersRepository,
    AnswerCommentsRepository,
  ],
})
export class PrismaDatabaseModule {}
