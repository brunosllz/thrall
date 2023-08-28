import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { AnswerComment } from '@modules/timeline/domain/entities/answer-comment';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  Result<void>,
  Result<AnswerComment[]>
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    pageIndex,
    pageSize,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    try {
      const answerComments =
        await this.answerCommentsRepository.findManyByAnswerId(answerId, {
          pageIndex,
          pageSize,
        });

      return right(Result.ok(answerComments));
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
