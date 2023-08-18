import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Project } from '@modules/timeline/domain/entities/project';

import { ProjectsRepository } from '../repositories/projects-repository';

interface GetProjectBySlugUseCaseRequest {
  slug: string;
}

type GetProjectBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    project: Project;
  }
>;

export class GetProjectBySlugUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute({
    slug,
  }: GetProjectBySlugUseCaseRequest): Promise<GetProjectBySlugUseCaseResponse> {
    const project = await this.projectsRepository.findBySlug(slug);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    return right({
      project,
    });
  }
}
