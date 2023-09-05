import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Project } from '@modules/project-management/domain/entities/project';

import { ProjectsDAO } from '../../dao/projects-dao';

interface FetchRecentProjectsUseCaseRequest {
  pageIndex: number;
  pageSize: number;
}

type FetchRecentProjectsUseCaseResponse = Either<
  Result<void>,
  Result<Project[]>
>;

export class FetchRecentProjectsUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    pageSize,
    pageIndex,
  }: FetchRecentProjectsUseCaseRequest): Promise<FetchRecentProjectsUseCaseResponse> {
    try {
      const projects = await this.projectsDAO.findManyRecent({
        pageIndex,
        pageSize,
      });

      return right(Result.ok(projects));
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
