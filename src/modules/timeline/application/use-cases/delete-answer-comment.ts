import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentRequest {
  id: string;
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<void>
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    id,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    try {
      const answerComment = await this.answerCommentsRepository.findById(id);

      if (!answerComment) {
        return left(new ResourceNotFoundError());
      }

      await this.answerCommentsRepository.delete(answerComment);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
