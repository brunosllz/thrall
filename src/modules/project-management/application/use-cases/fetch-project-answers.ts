import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Answer } from '@modules/project-management/domain/entities/answer';

import { AnswersRepository } from '../repositories/answers-repository';

interface FetchProjectAnswersUseCaseRequest {
  projectId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchProjectAnswersUseCaseResponse = Either<
  Result<void>,
  Result<Answer[]>
>;

export class FetchProjectAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    projectId,
    pageIndex,
    pageSize,
  }: FetchProjectAnswersUseCaseRequest): Promise<FetchProjectAnswersUseCaseResponse> {
    try {
      const answers = await this.answersRepository.findManyByProjectId(
        projectId,
        {
          pageIndex,
          pageSize,
        },
      );

      return right(Result.ok(answers));
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
