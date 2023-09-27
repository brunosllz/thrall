import { DomainEvent } from '@common/domain/events/domain-event';

import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  public occurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.answer.id;
  }
}
