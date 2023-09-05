import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { AnswerComment } from '@modules/project-management/domain/entities/answer-comment';

import { AnswerCommentsRepository } from '../../repositories/answer-comments-repository';
import { AnswersRepository } from '../../repositories/answers-repository';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError | Result<void>,
  Result<void>
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    try {
      const answer = await this.answersRepository.findById(answerId);

      if (!answer) {
        return left(new ResourceNotFoundError());
      }

      const answerCommentOrError = AnswerComment.create({
        authorId,
        answerId,
        content,
      });

      if (answerCommentOrError.isFailure) {
        return left(Result.fail(answerCommentOrError.error));
      }

      const answerComment = answerCommentOrError.getValue();

      await this.answerCommentsRepository.create(answerComment);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
