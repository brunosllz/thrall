import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerRequest {
  id: string;
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ id }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(id);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    await this.answersRepository.delete(answer);

    return right({});
  }
}
