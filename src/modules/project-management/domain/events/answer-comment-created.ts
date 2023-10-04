import { DomainEvent } from '@common/domain/events/domain-event';

import { AnswerComment } from '../entities/answer-comment';

export class AnswerCommentCreatedEvent implements DomainEvent {
  public occurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.answerComment.id;
  }
}
