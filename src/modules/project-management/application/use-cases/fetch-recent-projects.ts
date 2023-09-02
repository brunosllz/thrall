import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Project } from '@modules/project-management/domain/entities/project';

import { ProjectsRepository } from '../repositories/projects-repository';

interface FetchRecentProjectsUseCaseRequest {
  pageIndex: number;
  pageSize: number;
}

type FetchRecentProjectsUseCaseResponse = Either<
  Result<void>,
  Result<Project[]>
>;

export class FetchRecentProjectsUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute({
    pageSize,
    pageIndex,
  }: FetchRecentProjectsUseCaseRequest): Promise<FetchRecentProjectsUseCaseResponse> {
    try {
      const projects = await this.projectsRepository.findManyRecent({
        pageIndex,
        pageSize,
      });

      return right(Result.ok(projects));
    } catch (error) {
      console.log(error);

      return left(Result.fail<void>(error));
    }
  }
}
