import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface DeleteProjectRequest {
  authorId: string;
  projectId: string;
}

type DeleteProjectResponse = Either<
  ResourceNotFoundError | NotAllowedError | Result<void>,
  Result<void>
>;

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    authorId,
  }: DeleteProjectRequest): Promise<DeleteProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const isAuthor = project.authorId === authorId;

      if (!isAuthor) {
        return left(new NotAllowedError());
      }

      await this.projectsRepository.delete(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}
