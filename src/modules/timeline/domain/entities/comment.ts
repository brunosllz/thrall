import { AggregateRoot } from '@common/domain/entities/aggregate-root';

export interface CommentProps {
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<
  Props extends CommentProps,
> extends AggregateRoot<Props> {
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

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
}
