import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface AddInterestedInProjectRequest {
  projectId: string;
  userId: string;
}

type AddInterestedInProjectResponse = Either<
  ResourceNotFoundError | Result<any> | Result<void>,
  Result<void>
>;

@Injectable()
export class AddInterestedInProject {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    userId,
  }: AddInterestedInProjectRequest): Promise<AddInterestedInProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const addedInterestedOrError = project.addInterested(userId);

      if (addedInterestedOrError?.isFailure) {
        return left(Result.fail(addedInterestedOrError.error));
      }

      await this.projectsRepository.save(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}
