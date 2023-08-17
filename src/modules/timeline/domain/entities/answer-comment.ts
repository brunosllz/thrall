import { Optional } from '@common/logic/types/Optional';

import { AnswerCommentCreatedEvent } from '../events/answer-comment-created';
import { Comment, CommentProps } from './comment';

export interface AnswerCommentProps extends CommentProps {
  answerId: string;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: string) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswerComment = !id;

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(
        new AnswerCommentCreatedEvent(answerComment),
      );
    }

    return answerComment;
  }
}
