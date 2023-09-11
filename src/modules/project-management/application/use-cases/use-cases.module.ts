import { PrismaDatabaseModule } from '@modules/project-management/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { CreateAnswerInProjectUseCase } from './commands/create-answer-in-project';
import { CreateProjectUseCase } from './commands/create-project';
import { FetchProjectsByUserIdUseCase } from './queries/fetch-projects-by-user-id';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [
    CreateProjectUseCase,
    CreateAnswerInProjectUseCase,
    FetchProjectsByUserIdUseCase,
  ],
  exports: [
    CreateProjectUseCase,
    CreateAnswerInProjectUseCase,
    FetchProjectsByUserIdUseCase,
  ],
})
export class UseCasesModule {}
