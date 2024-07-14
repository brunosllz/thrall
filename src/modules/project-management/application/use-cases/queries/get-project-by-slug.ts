import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface GetProjectBySlugUseCaseRequest {
  slug: string;
}

type GetProjectBySlugUseCaseResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<any>
>;

@Injectable()
export class GetProjectBySlugUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    slug,
  }: GetProjectBySlugUseCaseRequest): Promise<GetProjectBySlugUseCaseResponse> {
    try {
      const project = await this.projectsDAO.findBySlug(slug);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      return right(Result.ok(project));
    } catch (error) {
      return left(error);
    }
  }
}
