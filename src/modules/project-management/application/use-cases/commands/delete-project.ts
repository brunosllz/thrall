import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface DeleteProjectRequest {
  id: string;
}

type DeleteProjectResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<void>
>;

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({ id }: DeleteProjectRequest): Promise<DeleteProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(id);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      await this.projectsRepository.delete(project);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
