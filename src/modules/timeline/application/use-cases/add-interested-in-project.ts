import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';

import { ProjectsRepository } from '../repositories/projects-repository';

interface AddInterestedInProjectRequest {
  projectId: string;
  userId: string;
}

type AddInterestedInProjectResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

export class AddInterestedInProject {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    userId,
  }: AddInterestedInProjectRequest): Promise<AddInterestedInProjectResponse> {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    project.addInterested(userId);

    await this.projectsRepository.save(project);

    return right({});
  }
}
