import { Either, right } from '@common/logic/either';
import { Notification } from '@modules/notification/domain/entities/notification';

import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  Record<string, never>
>;

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId,
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({});
  }
}
