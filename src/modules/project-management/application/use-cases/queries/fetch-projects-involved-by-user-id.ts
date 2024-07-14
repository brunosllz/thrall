import { PaginationQueryResponse } from '@/core/repositories/pagination-params';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface FetchProjectsInvolvedByUserIdUseCaseRequest {
  pageIndex: number;
  pageSize: number;
  userId: string;
}

type FetchProjectsInvolvedByUserIdUseCaseResponse = Either<
  Result<void>,
  Result<PaginationQueryResponse>
>;

@Injectable()
export class FetchProjectsInvolvedByUserIdUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    userId,
    pageSize,
    pageIndex,
  }: FetchProjectsInvolvedByUserIdUseCaseRequest): Promise<FetchProjectsInvolvedByUserIdUseCaseResponse> {
    try {
      const projects = await this.projectsDAO.findManyInvolvedByUserId(userId, {
        pageIndex,
        pageSize,
      });

      return right(Result.ok(projects));
    } catch (error) {
      return left(error);
    }
  }
}
