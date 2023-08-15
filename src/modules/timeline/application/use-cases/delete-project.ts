import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../repositories/project-repository';

interface DeleteProjectRequest {
  id: string;
}

type DeleteProjectResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({ id }: DeleteProjectRequest): Promise<DeleteProjectResponse> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    await this.projectRepository.delete(project);

    return right({});
  }
}
