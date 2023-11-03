import { Module } from '@nestjs/common';

import { PrismaDatabaseModule } from '../infra/prisma/prisma-database.module';
import { GetUserUseCase } from './use-cases/queries/get-user';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [GetUserUseCase],
  exports: [GetUserUseCase],
})
export class UseCasesModule {}
