import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';
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
    const resultGuard = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.answerId,
        argumentName: 'answerId',
      },
    ]);

    if (resultGuard.failed) {
      return Result.fail<AnswerComment>(resultGuard.message);
    }

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

    return Result.ok<AnswerComment>(answerComment);
  }
}
