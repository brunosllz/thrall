import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsDAO } from '../../dao/projects-dao';

interface FetchProjectsByUserIdUseCaseRequest {
  pageIndex: number;
  pageSize: number;
  userId: string;
}

type FetchProjectsByUserIdUseCaseResponse = Either<Result<void>, Result<any[]>>;

@Injectable()
export class FetchProjectsByUserIdUseCase {
  constructor(private projectsDAO: ProjectsDAO) {}

  async execute({
    userId,
    pageSize,
    pageIndex,
  }: FetchProjectsByUserIdUseCaseRequest): Promise<FetchProjectsByUserIdUseCaseResponse> {
    try {
      const projects = await this.projectsDAO.findManyByUserId(userId, {
        pageIndex,
        pageSize,
      });

      return right(Result.ok(projects));
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
