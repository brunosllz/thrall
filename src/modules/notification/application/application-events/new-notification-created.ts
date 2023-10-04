import { NotificationType } from '../../domain/entities/notification';

interface NewNotificationCreatedPayload {
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

export class NewNotificationCreatedApplicationEvent {
  constructor(readonly payload: NewNotificationCreatedPayload) {}
}
