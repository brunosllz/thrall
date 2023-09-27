import { AggregateRoot } from '@/common/domain/entities/aggregate-root';
import { Guard } from '@/common/logic/Guard';
import { Result } from '@/common/logic/result';
import { Optional } from '@common/logic/types/Optional';

import { NotificationReadEvent } from '../events/notification-read';

export enum NotificationType {
  MESSAGE = 'message',
  ACTION = 'action',
  INTERACTION = 'interaction',
  INFO = 'info',
}

export interface NotificationProps {
  authorId: string;
  recipientId: string;
  title: string;
  linkTo: string;
  ctaTitle?: string[];
  type: NotificationType;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  get authorId() {
    return this.props.authorId;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get linkTo() {
    return this.props.linkTo;
  }

  get ctaTitle() {
    return this.props.ctaTitle;
  }

  get type() {
    return this.props.type;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  read() {
    this.props.readAt = new Date();
    this.addDomainEvent(new NotificationReadEvent(this));
  }

  isRead() {
    return !!this.props.readAt;
  }

  static create(props: Optional<NotificationProps, 'createdAt'>, id?: string) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.authorId, argumentName: 'authorId' },
      { argument: props.recipientId, argumentName: 'recipientId' },
      { argument: props.title, argumentName: 'title' },
      { argument: props.linkTo, argumentName: 'linkTo' },
      { argument: props.type, argumentName: 'type' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Notification>(guardResult.message);
    }

    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return Result.ok<Notification>(notification);
  }
}
