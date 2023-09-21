import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import { ZodValidationPipe } from '@common/infra/pipes/zod-validation-pipe';
import { CreateAnswerInProjectUseCase } from '@modules/project-management/application/use-cases/commands/create-answer-in-project';
import { Body, Controller, Post } from '@nestjs/common';

import {
  CreateAnswerBodySchema,
  createAnswerBodySchema,
} from '../validation-schemas/create-answer-schema';

@Controller('/answers')
export class AnswerController {
  constructor(
    private readonly createAnswerInProjectUseCase: CreateAnswerInProjectUseCase,
  ) {}

  @Post()
  async createAnswerInProject(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createAnswerBodySchema))
    body: CreateAnswerBodySchema,
  ) {
    const { content, projectId } = body;
    const { userId } = user;

    await this.createAnswerInProjectUseCase.execute({
      authorId: userId,
      content,
      projectId,
    });
  }
}
