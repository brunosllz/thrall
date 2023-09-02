import { makeFakeAnswer } from '@test/factories/make-answer';

import { InMemoryAnswersRepository } from '../repositories/in-memory/in-memory-answers-repository';
import { FetchProjectAnswersUseCase } from './fetch-project-answers';

let answersRepository: InMemoryAnswersRepository;
let sut: FetchProjectAnswersUseCase;

describe('Fetch project answers', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new FetchProjectAnswersUseCase(answersRepository);
  });

  it('should be able to fetch many answers by project id', async () => {
    let errorOccurred = false;
    try {
      answersRepository.create(
        makeFakeAnswer({
          projectId: '1',
        }),
      );

      answersRepository.create(
        makeFakeAnswer({
          projectId: '1',
        }),
      );

      const result = await sut.execute({
        projectId: '1',
        pageIndex: 1,
        pageSize: 5,
      });

      const answers = result.value?.getValue();

      expect(result.isRight()).toBe(true);
      expect(answers).toHaveLength(2);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to fetch paginated project answers', async () => {
    let errorOccurred = false;
    try {
      for (let i = 1; i <= 10; i++) {
        await answersRepository.create(
          makeFakeAnswer({
            projectId: '1',
          }),
        );
      }

      const result = await sut.execute({
        projectId: '1',
        pageIndex: 2,
        pageSize: 8,
      });

      const answers = result.value?.getValue();

      expect(answers).toHaveLength(2);
      expect(result.isRight()).toBe(true);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
