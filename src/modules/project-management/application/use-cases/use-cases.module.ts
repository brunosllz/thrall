import { PrismaDatabaseModule } from '@modules/project-management/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { CreateAnswerInProjectUseCase } from './commands/create-answer-in-project';
import { CreateProjectUseCase } from './commands/create-project';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [CreateProjectUseCase, CreateAnswerInProjectUseCase],
  exports: [CreateProjectUseCase, CreateAnswerInProjectUseCase],
})
export class UseCasesModule {}
