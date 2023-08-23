import { Notification } from '@modules/notification/domain/entities/notification';
import { Notification as RawNotification } from '@prisma/client';

export class NotificationMapper {
  static toDomain(raw: RawNotification): Notification {
    const notification = Notification.create(
      {
        content: raw.content,
        recipientId: raw.recipientId,
        title: raw.title,
        createdAt: raw.createdAt,
        readAt: raw.readAt ?? undefined,
        authorId: raw.authorId,
      },
      raw.id,
    );

    return notification;
  }

  static toPersistence(notification: Notification): RawNotification {
    return {
      authorId: notification.authorId,
      content: notification.content,
      createdAt: notification.createdAt,
      id: notification.id,
      readAt: notification.readAt ?? null,
      recipientId: notification.recipientId,
      title: notification.title,
    };
  }
}
