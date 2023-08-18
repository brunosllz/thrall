import { faker } from '@faker-js/faker';

import { InMemoryAnswersRepository } from '../repositories/in-memory/in-memory-answers-repository';
import { AnswerProjectUseCase } from './answer-project';

let sut: AnswerProjectUseCase;
let answerRepository: InMemoryAnswersRepository;

describe('Create answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository();
    sut = new AnswerProjectUseCase(answerRepository);
  });

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      projectId: '1',
      content: faker.lorem.paragraphs(),
    });

    expect(result.isRight()).toBe(true);
    expect(answerRepository.items).toHaveLength(1);
    expect(answerRepository.items[0]).toMatchObject({
      authorId: '1',
      projectId: '1',
    });
  });
});
