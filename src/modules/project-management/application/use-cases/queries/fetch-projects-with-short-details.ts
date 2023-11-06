import { PaginationQueryResponse } from '@/common/repositories/pagination-params';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface FetchRecentProjectsUseCaseRequest {
  roles: string[];
  technologies: string[];
  date: string;
  pageIndex: number;
  pageSize: number;
}

type FetchRecentProjectsUseCaseResponse = Either<
  Result<void>,
  Result<PaginationQueryResponse>
>;

@Injectable()
export class FetchProjectsWithShortDetailsUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    date,
    roles,
    technologies,
    pageSize,
    pageIndex,
  }: FetchRecentProjectsUseCaseRequest): Promise<FetchRecentProjectsUseCaseResponse> {
    try {
      const projects = await this.projectsDAO.findManyWithShortDetails(
        {
          date,
          roles,
          technologies,
        },
        {
          pageIndex,
          pageSize,
        },
      );

      return right(Result.ok(projects));
    } catch (error) {
      return left(error);
    }
  }
}
