import { UseCasesModule } from '@modules/account/application/use-cases.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UseCasesModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
