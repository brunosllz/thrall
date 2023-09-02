import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface EditAnswerCommentRequest {
  answerCommentId: string;
  authorId: string;
  content: string;
}

type EditAnswerCommentResponse = Either<
  ResourceNotFoundError | NotFoundError | Result<void>,
  Result<void>
>;

@Injectable()
export class EditAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerCommentId,
    authorId,
    content,
  }: EditAnswerCommentRequest): Promise<EditAnswerCommentResponse> {
    try {
      const answerComment = await this.answerCommentsRepository.findById(
        answerCommentId,
      );

      if (!answerComment) {
        return left(new ResourceNotFoundError());
      }

      if (authorId !== answerComment.authorId) {
        return left(new NotAllowedError());
      }

      answerComment.content = content;

      await this.answerCommentsRepository.save(answerComment);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
