import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface FetchGeneralSkillsFromProjectsUseCaseRequest {
  search?: string;
}

type FetchGeneralSkillsFromProjectsUseCaseResponse = Either<
  Result<void>,
  Result<any[]>
>;

@Injectable()
export class FetchGeneralSkillsFromProjectsUseCase {
  constructor(private readonly projectsDAO: ProjectsDAO) {}

  async execute({
    search,
  }: FetchGeneralSkillsFromProjectsUseCaseRequest): Promise<FetchGeneralSkillsFromProjectsUseCaseResponse> {
    try {
      const projects =
        await this.projectsDAO.findManyGeneralSkillsToTheProjects({ search });

      return right(Result.ok(projects));
    } catch (error) {
      return left(error);
    }
  }
}
