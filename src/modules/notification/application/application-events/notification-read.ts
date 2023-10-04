interface NotificationReadEventPayload {
  occurredAt: Date;
  notificationId: string;
  recipientId: string;
}

export class NotificationReadApplicationEvent {
  constructor(readonly payload: NotificationReadEventPayload) {}
}
