import { UseCasesModule } from '@modules/account/application/use-cases.module';
import { Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [UsersController],
  providers: [],
})
export class HttpModule {}
