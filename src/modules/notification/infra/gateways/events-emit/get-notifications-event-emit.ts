import { NotificationType } from '@/modules/notification/domain/entities/notification';

type Notification = {
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
};

interface NotificationsEventEmitPayload {
  notifications: Notification[];
}

export class GetNotificationsEventEmit {
  constructor(readonly payload: NotificationsEventEmitPayload) {}
}
