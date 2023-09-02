import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { Answer } from '../../domain/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

interface CreateAnswerInProjectRequest {
  projectId: string;
  authorId: string;
  content: string;
}

type CreateAnswerInProjectResponse = Either<Result<void>, Result<void>>;

@Injectable()
export class CreateAnswerInProjectUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    content,
    projectId,
    authorId,
  }: CreateAnswerInProjectRequest): Promise<CreateAnswerInProjectResponse> {
    try {
      const answerOrError = Answer.create({
        authorId,
        projectId,
        content,
      });

      if (answerOrError.isFailure) {
        return left(Result.fail<void>(answerOrError.error));
      }

      const answer = answerOrError.getValue();

      await this.answersRepository.create(answer);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
