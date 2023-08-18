import { makeFakeAnswer } from '@test/factories/make-answer';
import { makeFakeProject } from '@test/factories/make-project';

describe('Answer', () => {
  it('should be able to create excerpt from answer content', () => {
    const post = makeFakeProject();

    expect(post.excerpt.length).toBeGreaterThanOrEqual(120);
    expect(post.excerpt.length).toBeLessThanOrEqual(123);
  });

  it('should be able dispatch a event when create a new answer', () => {
    const answer = makeFakeAnswer();

    expect(answer.domainEvents).toHaveLength(1);
    expect(answer.domainEvents[0].getAggregateId()).toEqual(answer.id);
  });
});
