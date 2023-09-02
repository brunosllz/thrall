import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

import { AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerRequest {
  answerId: string;
  authorId: string;
  content: string;
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotFoundError | Result<void>,
  Result<void>
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    try {
      const answer = await this.answersRepository.findById(answerId);

      if (!answer) {
        return left(new ResourceNotFoundError());
      }

      if (authorId !== answer.authorId) {
        return left(new NotAllowedError());
      }

      answer.content = content;

      await this.answersRepository.save(answer);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
