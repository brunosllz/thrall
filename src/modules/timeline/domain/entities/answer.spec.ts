import { makeFakeAnswer } from '@test/factories/make-answer';

describe('Answer', () => {
  it('should be able to create excerpt from answer content', () => {
    const answer = makeFakeAnswer();

    expect(answer.getValue().excerpt.length).toBeGreaterThanOrEqual(120);
    expect(answer.getValue().excerpt.length).toBeLessThanOrEqual(123);
  });

  it('should be able dispatch a event when create a new answer', () => {
    const answerOrError = makeFakeAnswer();

    if (answerOrError.isSuccess) {
      const answer = answerOrError.getValue();

      expect(answer.domainEvents).toHaveLength(1);
      expect(answer.domainEvents[0].getAggregateId()).toEqual(answer.id);
    }
  });
});
