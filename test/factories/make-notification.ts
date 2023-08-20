import { faker } from '@faker-js/faker';
import {
  Notification,
  NotificationProps,
} from '@modules/notification/domain/entities/notification';

export function makeFakeNotification(
  override: Partial<NotificationProps> = {},
  id?: string,
) {
  const notification = Notification.create(
    {
      recipientId: faker.string.uuid(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}
