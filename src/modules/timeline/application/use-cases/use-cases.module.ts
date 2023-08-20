import { PrismaDatabaseModule } from '@modules/timeline/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { CreateProjectUseCase } from './create-project';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [CreateProjectUseCase],
  exports: [CreateProjectUseCase],
})
export class UseCasesModule {}
