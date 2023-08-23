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
    const { authorId, content, requirements, roles, technologies, title } =
      body;

    await this.createProjectUseCase.execute({
      authorId,
      content,
      requirements,
      roles,
      technologies,
      title,
    });
  }
}
