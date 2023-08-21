import { Module } from '@nestjs/common';

import { PrismaDatabaseModule } from '../infra/prisma/prisma-database.module';
import { EditProfileUseCase } from './use-cases/edit-profile';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [EditProfileUseCase],
  exports: [EditProfileUseCase],
})
export class UseCasesModule {}
