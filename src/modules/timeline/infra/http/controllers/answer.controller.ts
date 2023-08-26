import { CreateAnswerInProjectUseCase } from '@modules/timeline/application/use-cases/create-answer-in-project';
import { Body, Controller, Post } from '@nestjs/common';

import { CreateAnswerDTO } from '../dto/create-answer-dto';

@Controller('/answers')
export class AnswerController {
  constructor(
    private readonly createAnswerInProjectUseCase: CreateAnswerInProjectUseCase,
  ) {}

  @Post()
  async createAnswerInProject(@Body() body: CreateAnswerDTO) {
    const { authorId, content, projectId } = body;

    await this.createAnswerInProjectUseCase.execute({
      authorId,
      content,
      projectId,
    });
  }
}
