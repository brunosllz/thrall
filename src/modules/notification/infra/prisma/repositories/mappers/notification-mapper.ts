import {
  Notification,
  NotificationType,
} from '@modules/notification/domain/entities/notification';
import { Notification as RawNotification } from '@prisma/client';

export class NotificationMapper {
  static toDomain(raw: RawNotification): Notification {
    const notification = Notification.create(
      {
        linkTo: raw.linkTo,
        ctaTitle: raw.ctaTitle.length > 0 ? raw.ctaTitle : undefined,
        type: raw.type as NotificationType,
        recipientId: raw.recipientId,
        title: raw.title,
        createdAt: raw.createdAt,
        readAt: raw.readAt ?? undefined,
        authorId: raw.authorId,
      },
      raw.id,
    ).getValue();

    return notification;
  }

  static toPersistence(notification: Notification): RawNotification {
    return {
      authorId: notification.authorId,
      linkTo: notification.linkTo,
      ctaTitle: notification.ctaTitle ?? [],
      type: notification.type,
      createdAt: notification.createdAt,
      id: notification.id,
      readAt: notification.readAt ?? null,
      recipientId: notification.recipientId,
      title: notification.title,
    };
  }
}
