import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let notificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(notificationsRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      authorId: '1',
      recipientId: '2',
      title: 'new notification',
      content: 'content example',
    });

    expect(result.isRight()).toBe(true);
    expect(notificationsRepository.items[0]).toMatchObject({
      authorId: '1',
      recipientId: '2',
      title: 'new notification',
      content: 'content example',
    });
  });
});
