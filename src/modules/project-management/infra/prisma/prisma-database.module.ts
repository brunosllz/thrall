import { PrismaService } from '@common/infra/prisma/prisma.service';
import { ProjectsDAO } from '@modules/project-management/application/dao/projects-dao';
import { AnswerCommentsRepository } from '@modules/project-management/application/repositories/answer-comments-repository';
import { AnswersRepository } from '@modules/project-management/application/repositories/answers-repository';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { Module } from '@nestjs/common';

import { PrismaProjectsDAO } from './dao/prisma-projects-dao';
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository';
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
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: ProjectsDAO,
      useClass: PrismaProjectsDAO,
    },
  ],
  exports: [
    PrismaService,
    ProjectsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    ProjectsDAO,
  ],
})
export class PrismaDatabaseModule {}
