import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeAnswer } from '@test/factories/make-answer';

import { InMemoryAnswerCommentsRepository } from '../../repositories/in-memory/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from '../../repositories/in-memory/in-memory-answers-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to comment on answer', async () => {
    let errorOccurred = false;
    try {
      const answer = makeFakeAnswer();

      await inMemoryAnswersRepository.create(answer);

      const result = await sut.execute({
        answerId: answer.id.toString(),
        authorId: answer.authorId.toString(),
        content: 'content example',
      });

      expect(result.isRight()).toBe(true);
      expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
        'content example',
      );
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to comment on answer with non exist answer id', async () => {
    let errorOccurred = false;
    try {
      const result = await sut.execute({
        answerId: 'non-id',
        authorId: 'non-id',
        content: 'content example',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
