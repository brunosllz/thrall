import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeAnswer } from '@test/factories/make-answer';

import { InMemoryAnswersRepository } from '../repositories/in-memory/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';

let sut: EditAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;

describe('Edit a answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();

    sut = new EditAnswerUseCase(answersRepository);
  });

  it('should be able edit a answer', async () => {
    const answers = makeFakeAnswer({
      authorId: '1',
    });

    await answersRepository.create(answers);

    const result = await sut.execute({
      answerId: answers.id,
      authorId: '1',
      content: 'example content',
    });

    expect(result.isRight()).toBe(true);
    expect(answersRepository.items[0]).toMatchObject({
      content: 'example content',
    });
  });

  it('should be not able edit a answer with non exists id', async () => {
    const answers = makeFakeAnswer({
      authorId: '1',
    });

    await answersRepository.create(answers);

    const result = await sut.execute({
      answerId: 'non-id',
      authorId: '1',
      content: 'content example 2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be not able edit a answers with invalid author id', async () => {
    const answers = makeFakeAnswer();

    await answersRepository.create(answers);

    const result = await sut.execute({
      answerId: answers.id,
      authorId: 'non-id',
      content: 'content example 2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
