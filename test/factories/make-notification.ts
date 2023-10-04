import { faker } from '@faker-js/faker';
import {
  Notification,
  NotificationProps,
  NotificationType,
} from '@modules/notification/domain/entities/notification';

type Overrides = Partial<NotificationProps>;

export function makeFakeNotification(override: Overrides = {}, id?: string) {
  const notification = Notification.create(
    {
      authorId: faker.string.uuid(),
      recipientId: faker.string.uuid(),
      title: faker.lorem.sentence(4),
      ctaTitle: [],
      linkTo: faker.internet.url(),
      type: NotificationType.INTERACTION,
      ...override,
    },
    id,
  ).getValue();

  return notification;
}
