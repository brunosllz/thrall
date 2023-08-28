import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Project } from '@modules/timeline/domain/entities/project';

import { ProjectsRepository } from '../repositories/projects-repository';

interface GetProjectBySlugUseCaseRequest {
  slug: string;
  authorId: string;
}

type GetProjectBySlugUseCaseResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<Project>
>;

export class GetProjectBySlugUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute({
    slug,
    authorId,
  }: GetProjectBySlugUseCaseRequest): Promise<GetProjectBySlugUseCaseResponse> {
    try {
      const project = await this.projectsRepository.findBySlug(slug, authorId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      return right(Result.ok(project));
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
