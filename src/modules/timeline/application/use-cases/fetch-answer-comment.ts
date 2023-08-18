import { Either, right } from '@common/logic/either';
import { AnswerComment } from '@modules/timeline/domain/entities/answer-comment';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    pageIndex,
    pageSize,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        pageIndex,
        pageSize,
      });

    return right({
      answerComments,
    });
  }
}
