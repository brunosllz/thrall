import { DomainEvent } from '@common/domain/events/domain-event';

import { Notification } from '../entities/notification';

export class NotificationReadEvent implements DomainEvent {
  public occurredAt: Date;
  public notification: Notification;

  constructor(notification: Notification) {
    this.notification = notification;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.notification.id;
  }
}
