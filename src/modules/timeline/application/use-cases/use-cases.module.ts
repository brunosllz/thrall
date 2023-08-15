import { Module } from '@nestjs/common';

import { CreateProjectUseCase } from './create-project';

//TODO: import database module
@Module({
  imports: [],
  providers: [CreateProjectUseCase],
})
export class UseCasesModule {}
