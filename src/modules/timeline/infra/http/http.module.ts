import { UseCasesModule } from '@modules/timeline/application/use-cases/use-cases.module';
import { Module } from '@nestjs/common';

import { AnswerController } from './controllers/answer.controller';
import { ProjectController } from './controllers/project.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [ProjectController, AnswerController],
})
export class HttpModule {}
