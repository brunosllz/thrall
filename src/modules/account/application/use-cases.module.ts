import { Module } from '@nestjs/common';

import { PrismaDatabaseModule } from '../infra/prisma/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [],
  exports: [],
})
export class UseCasesModule {}
