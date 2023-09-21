import { makeFakeAnswerComment } from '@test/factories/make-answer-comment';

import { InMemoryAnswerCommentsRepository } from '../../repositories/in-memory/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    let errorOccurred = false;

    try {
      await inMemoryAnswerCommentsRepository.create(
        makeFakeAnswerComment({
          answerId: 'answer-1',
        }),
      );

      await inMemoryAnswerCommentsRepository.create(
        makeFakeAnswerComment({
          answerId: 'answer-1',
        }),
      );

      await inMemoryAnswerCommentsRepository.create(
        makeFakeAnswerComment({
          answerId: 'answer-1',
        }),
      );

      const result = await sut.execute({
        answerId: 'answer-1',
        pageIndex: 1,
        pageSize: 5,
      });

      const answerComments = result.value?.getValue();

      expect(answerComments).toHaveLength(3);
      expect(result.isRight()).toBe(true);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to fetch paginated answer comments', async () => {
    let errorOccurred = false;

    try {
      for (let i = 1; i <= 10; i++) {
        await inMemoryAnswerCommentsRepository.create(
          makeFakeAnswerComment({
            answerId: 'answer-1',
          }),
        );
      }

      const result = await sut.execute({
        answerId: 'answer-1',
        pageIndex: 2,
        pageSize: 8,
      });

      const answerComments = result.value?.getValue();

      expect(answerComments).toHaveLength(2);
      expect(result.isRight()).toBe(true);
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalsy();
  });
});
