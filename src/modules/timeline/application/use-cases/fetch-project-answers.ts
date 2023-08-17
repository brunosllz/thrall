import { Either, right } from '@common/logic/either';
import { Answer } from '@modules/timeline/domain/entities/answer';

import { AnswersRepository } from '../repositories/answers-repository';

interface FetchProjectAnswersUseCaseRequest {
  projectId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchProjectAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchProjectAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    projectId,
    pageIndex,
    pageSize,
  }: FetchProjectAnswersUseCaseRequest): Promise<FetchProjectAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByProjectId(
      projectId,
      {
        pageIndex,
        pageSize,
      },
    );

    return right({
      answers,
    });
  }
}
