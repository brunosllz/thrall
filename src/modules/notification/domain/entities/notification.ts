import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

export interface NotificationProps {
  authorId: string;
  recipientId: string;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get authorId() {
    return this.props.authorId;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(props: Optional<NotificationProps, 'createdAt'>, id?: string) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
