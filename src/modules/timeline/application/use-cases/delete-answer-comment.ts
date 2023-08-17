import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerCommentRequest {
  id: string;
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    id,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment = await this.answerCommentsRepository.findById(id);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    await this.answerCommentsRepository.delete(answerComment);

    return right({});
  }
}
