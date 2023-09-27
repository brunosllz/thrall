import { Result } from '@/common/logic/result';
import { Either, left, right } from '@common/logic/either';
import {
  Notification,
  NotificationType,
} from '@modules/notification/domain/entities/notification';
import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseRequest {
  authorId: string;
  recipientId: string;
  title: string;
  ctaTitle?: string[];
  linkTo: string;
  type: NotificationType;
}

export type SendNotificationUseCaseResponse = Either<
  Result<any>,
  Result<Notification>
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    authorId,
    recipientId,
    title,
    linkTo,
    type,
    ctaTitle,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    try {
      const notificationOrError = Notification.create({
        authorId,
        recipientId,
        title,
        linkTo,
        ctaTitle,
        type,
      });

      if (notificationOrError.isFailure) {
        return left(Result.fail(notificationOrError.error));
      }

      const notification = notificationOrError.getValue();
      await this.notificationsRepository.create(notification);

      return right(Result.ok(notification));
    } catch (error) {
      return left(Result.fail(error));
    }
  }
}
