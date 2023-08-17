import { AggregateRoot } from '@common/domain/entities/aggregate-root';
import { Optional } from '@common/logic/types/Optional';

import { AnswerCreatedEvent } from '../events/answer-created';

export interface AnswerProps {
  projectId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get projectId() {
    return this.props.projectId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  get excerpt() {
    if (this.content.length >= 120) {
      return this.props.content.substring(0, 120).trimEnd().concat('...');
    }

    return this.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<AnswerProps, 'createdAt'>, id?: string) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
