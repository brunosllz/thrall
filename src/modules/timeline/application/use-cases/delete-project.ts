import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../repositories/project-repository';

interface DeleteProjectRequest {
  id: string;
}

type DeleteProjectResponse = Promise<void>;

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({ id }: DeleteProjectRequest): DeleteProjectResponse {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new Error('resources not found.');
    }

    await this.projectRepository.delete(project);
  }
}
