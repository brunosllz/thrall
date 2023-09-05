import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { Result } from '@common/logic/result';
import { CreateProjectUseCase } from '@modules/project-management/application/use-cases/commands/create-project';
import { Body, Controller, Post } from '@nestjs/common';

import { CreateProjectDTO } from '../dto/create-project-dto';

@Controller('/projects')
export class ProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  @Post()
  async createProject(@Body() body: CreateProjectDTO) {
    const {
      authorId,
      description,
      requirement,
      roles,
      technologies,
      name,
      status,
      imageUrl,
    } = body;

    const result = await this.createProjectUseCase.execute({
      authorId,
      name,
      requirement,
      roles,
      technologies,
      description,
      status,
      imageUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof Result) {
        return {
          statusCode: 400,
          message: error.errorValue(),
        };
      }

      if (error instanceof AlreadyExistsError) {
        return {
          statusCode: 409,
          message: error.message,
        };
      }
    }
  }
}
