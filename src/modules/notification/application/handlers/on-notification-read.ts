import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { NotificationReadEvent } from '../../domain/events/notification-read';
import { NotificationReadApplicationEvent } from '../application-events/notification-read';

@Injectable()
export class OnNotificationRead implements EventHandler {
  constructor(private readonly event: EventEmitter2) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.emitEventWhenNotificationRead.bind(this),
      NotificationReadEvent.name,
    );
  }

  private async emitEventWhenNotificationRead({
    notification,
    occurredAt,
  }: NotificationReadEvent) {
    this.event.emitAsync(
      'notification:read',
      new NotificationReadApplicationEvent({
        notificationId: notification.id,
        occurredAt,
        recipientId: notification.recipientId,
      }),
    );
  }
}
