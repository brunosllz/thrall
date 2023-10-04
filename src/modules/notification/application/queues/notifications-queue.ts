import { Process, Processor } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';

import { NewNotificationCreatedApplicationEvent } from '../application-events/new-notification-created';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { SendNotificationJob } from './jobs/send-notification-job';

@Processor('notifications')
export class NotificationsQueue {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Process('answer-created')
  @Process('answer-comment-created')
  async sendNotificationProcessor({ data }: Job<SendNotificationJob>) {
    const notification = data.payload;

    const notificationOrError = await this.sendNotificationUseCase.execute(
      notification,
    );

    if (notificationOrError.value.isFailure) {
      //TODO: create log when this failure happens
      return;
    }

    const createdNotification = notificationOrError.value.getValue();

    this.eventEmitter.emitAsync(
      'notification:answer-created',
      new NewNotificationCreatedApplicationEvent({
        id: createdNotification.id,
        authorId: notification.authorId,
        recipientId: notification.recipientId,
        avatarFrom: notification.authorAvatar ?? null,
        ctaTitle: notification.ctaTitle ?? null,
        linkTo: notification.linkTo,
        title: notification.title,
        type: notification.type,
        readAt: createdNotification.readAt ?? null,
        createdAt: createdNotification.createdAt,
      }),
    );
  }
}
