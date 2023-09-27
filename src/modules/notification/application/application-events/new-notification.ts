import { NotificationType } from '../../domain/entities/notification';

interface NewNotificationPayload {
  authorId: string;
  recipientId: string;
  title: string;
  linkTo: string;
  type: NotificationType;
  ctaTitle: string[] | null;
  createdAt: Date;
  readAt: Date | null;
  id: string;
  avatarFrom: string | null;
}

export class NewNotificationApplicationEvent {
  constructor(readonly payload: NewNotificationPayload) {}
}
