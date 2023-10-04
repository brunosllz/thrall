import { NotAllowedError } from '@common/errors/errors/not-allowed-error';

import { makeFakeNotification } from '@test/factories/make-notification';

import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository';
import { ReadNotificationUseCase } from './read-notification';

let notificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(notificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeFakeNotification();

    notificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId,
      notificationId: notification.id,
    });

    expect(result.isRight()).toBe(true);
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeFakeNotification({
      recipientId: 'recipient-1',
    });

    notificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
