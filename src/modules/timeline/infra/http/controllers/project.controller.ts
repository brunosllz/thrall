import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { IsPublic } from '@common/infra/http/auth/is-public';
import { CreateProjectUseCase } from '@modules/timeline/application/use-cases/create-project';
import { Body, Controller, Post } from '@nestjs/common';

import { CreateProjectDTO } from '../dto/create-project-dto';

@Controller('/projects')
export class ProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  @Post()
  @IsPublic()
  async createProject(@Body() body: CreateProjectDTO) {
    const { authorId, content, requirement, roles, technologies, title } = body;

    const result = await this.createProjectUseCase.execute({
      authorId,
      content,
      requirement,
      roles,
      technologies,
      title,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof AlreadyExistsError) {
        return {
          statusCode: 409,
          message: error.message,
        };
      }
    }
  }
}
