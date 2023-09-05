import { faker } from '@faker-js/faker';

import { InMemoryAnswersRepository } from '../../repositories/in-memory/in-memory-answers-repository';
import { CreateAnswerInProjectUseCase } from './create-answer-in-project';

let sut: CreateAnswerInProjectUseCase;
let answerRepository: InMemoryAnswersRepository;

describe('Create answer in project', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository();
    sut = new CreateAnswerInProjectUseCase(answerRepository);
  });

  it('should be able to create a answer', async () => {
    let errorOccurred = false;
    try {
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
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
