import { Either, right } from '@common/logic/either';
import { Notification } from '@modules/notification/domain/entities/notification';
import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
  authorId: string;
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  Record<string, never>
>;
@Processor('notifications')
@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  @Process('send-notification')
  async execute({
    authorId,
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      authorId,
      recipientId,
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({});
  }
}
