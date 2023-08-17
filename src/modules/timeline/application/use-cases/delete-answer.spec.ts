import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeAnswer } from '@test/factories/make-answer';

import { InMemoryAnswersRepository } from '../repositories/in-memory/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';

let sut: DeleteAnswerUseCase;
let answerRepository: InMemoryAnswersRepository;

describe('Delete answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(answerRepository);
  });

  it('should be able to delete a answer', async () => {
    const answer = makeFakeAnswer({}, '1');

    await answerRepository.create(answer);

    const result = await sut.execute({
      id: '1',
    });

    expect(result.isRight()).toBe(true);
    expect(answerRepository.items).toHaveLength(0);
  });

  it('should be not able to delete a answer with non exist id', async () => {
    const answer = makeFakeAnswer({}, '1');

    await answerRepository.create(answer);

    const result = await sut.execute({
      id: 'non-exist',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
