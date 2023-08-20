import { CreateProjectUseCase } from '@modules/timeline/application/use-cases/create-project';
import { Controller, Post } from '@nestjs/common';

@Controller('/projects')
export class ProjectController {
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  @Post()
  async createProject() {
    await this.createProjectUseCase.execute({
      authorId: '1',
      content: 'content',
      requirements: {
        content: 'content',
        timeAmount: 1,
        timeIdentifier: 'day',
      },
      roles: [{ amount: 1, name: 'react native' }],
      technologies: [{ slug: 'react' }],
      title: 'title',
    });
  }
}
