import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeAnswerComment } from '@test/factories/make-answer-comment';

import { InMemoryAnswerCommentsRepository } from '../repositories/in-memory/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

let sut: DeleteAnswerCommentUseCase;
let answerCommentRepository: InMemoryAnswerCommentsRepository;

describe('Delete answer comment comment', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository);
  });

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeFakeAnswerComment({}, '1');

    await answerCommentRepository.create(answerComment);

    const result = await sut.execute({
      id: '1',
    });

    expect(result.isRight()).toBe(true);
    expect(answerCommentRepository.items).toHaveLength(0);
  });

  it('should be not able to delete a answer comment with non exist id', async () => {
    const answerComment = makeFakeAnswerComment({}, '1');

    await answerCommentRepository.create(answerComment);

    const result = await sut.execute({
      id: 'non-exist',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
