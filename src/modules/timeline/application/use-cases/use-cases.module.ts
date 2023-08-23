import { PrismaDatabaseModule } from '@modules/timeline/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { CreateAnswerInProjectUseCase } from './create-answer-in-project';
import { CreateProjectUseCase } from './create-project';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [CreateProjectUseCase, CreateAnswerInProjectUseCase],
  exports: [CreateProjectUseCase, CreateAnswerInProjectUseCase],
})
export class UseCasesModule {}
