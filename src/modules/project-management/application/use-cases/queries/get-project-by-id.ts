import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface GetProjectByIdUseCaseRequest {
  projectId: string;
}

type GetProjectByIdUseCaseResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<any>
>;

@Injectable()
export class GetProjectByIdUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    projectId,
  }: GetProjectByIdUseCaseRequest): Promise<GetProjectByIdUseCaseResponse> {
    try {
      const project = await this.projectsDAO.findDetailsById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      return right(Result.ok(project));
    } catch (error) {
      return left(error);
    }
  }
}
