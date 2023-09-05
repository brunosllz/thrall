import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeAnswerComment } from '@test/factories/make-answer-comment';

import { InMemoryAnswerCommentsRepository } from '../../repositories/in-memory/in-memory-answer-comments-repository';
import { EditAnswerCommentUseCase } from './edit-answer-comment';

let sut: EditAnswerCommentUseCase;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;

describe('Edit a answer comment', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new EditAnswerCommentUseCase(answerCommentsRepository);
  });

  it('should be able edit a answer comment', async () => {
    let errorOccurred = false;

    try {
      const answerComment = makeFakeAnswerComment({
        authorId: '1',
      });

      await answerCommentsRepository.create(answerComment);

      const result = await sut.execute({
        answerCommentId: answerComment.id,
        authorId: '1',
        content: 'example content',
      });

      expect(result.isRight()).toBe(true);
      expect(answerCommentsRepository.items[0]).toMatchObject({
        content: 'example content',
      });
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a answer comment with non exists id', async () => {
    let errorOccurred = false;

    try {
      const answerComment = makeFakeAnswerComment({
        authorId: '1',
      });

      await answerCommentsRepository.create(answerComment);

      const result = await sut.execute({
        answerCommentId: 'non-id',
        authorId: '1',
        content: 'content example 2',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a answer comment with invalid author id', async () => {
    let errorOccurred = false;

    try {
      const answerComment = makeFakeAnswerComment();

      await answerCommentsRepository.create(answerComment);

      const result = await sut.execute({
        answerCommentId: answerComment.id,
        authorId: 'non-id',
        content: 'content example 2',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
