import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { SendNotificationJob } from '../jobs/send-notification-job';
import { SendNotificationUseCase } from '../use-cases/send-notification';

@Processor('notifications')
export class NotificationsQueue {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  @Process('answer-created')
  @Process('answer-comment-created')
  async sendNotificationProcessor({ data }: Job<SendNotificationJob>) {
    const notification = data.props;

    await this.sendNotificationUseCase.execute(notification);
  }
}
