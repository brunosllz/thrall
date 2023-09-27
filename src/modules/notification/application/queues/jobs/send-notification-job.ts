import { NotificationType } from '../../../domain/entities/notification';

interface SendNotificationJobPayload {
  title: string;
  recipientId: string | 'everybody';
  linkTo: string;
  authorId: string;
  authorAvatar?: string;
  ctaTitle?: string[];
  type: NotificationType;
}

export class SendNotificationJob {
  constructor(readonly payload: SendNotificationJobPayload) {}
}
