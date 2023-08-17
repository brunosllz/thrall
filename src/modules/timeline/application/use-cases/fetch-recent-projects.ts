import { Either, right } from '@common/logic/either';
import { Project } from '@modules/timeline/domain/entities/project';

import { ProjectsRepository } from '../repositories/projects-repository';

interface FetchRecentProjectsUseCaseRequest {
  pageIndex: number;
  pageSize: number;
}

type FetchRecentProjectsUseCaseResponse = Either<
  null,
  {
    projects: Project[];
  }
>;

export class FetchRecentProjectsUseCase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute({
    pageSize,
    pageIndex,
  }: FetchRecentProjectsUseCaseRequest): Promise<FetchRecentProjectsUseCaseResponse> {
    const projects = await this.projectsRepository.findManyRecent({
      pageIndex,
      pageSize,
    });

    return right({
      projects,
    });
  }
}
