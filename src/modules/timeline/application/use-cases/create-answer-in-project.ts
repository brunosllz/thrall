import { Either, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { Answer } from '../../domain/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

interface CreateAnswerInProjectRequest {
  projectId: string;
  authorId: string;
  content: string;
}

type CreateAnswerInProjectResponse = Either<
  Record<string, never>,
  Record<string, never>
>;

@Injectable()
export class CreateAnswerInProjectUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    content,
    projectId,
    authorId,
  }: CreateAnswerInProjectRequest): Promise<CreateAnswerInProjectResponse> {
    const answer = Answer.create({
      authorId,
      projectId,
      content,
    });

    await this.answersRepository.create(answer);

    return right({});
  }
}
