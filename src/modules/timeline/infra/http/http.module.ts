import { UseCasesModule } from '@modules/timeline/application/use-cases/use-cases.module';
import { Module } from '@nestjs/common';

import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [ProjectController],
})
export class HttpModule {}
