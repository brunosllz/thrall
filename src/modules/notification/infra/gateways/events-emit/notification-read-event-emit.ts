interface NotificationReadEventEmitPayload {
  occurredAt: Date;
  notificationId: string;
}

export class NotificationReadEventEmit {
  constructor(readonly payload: NotificationReadEventEmitPayload) {}
}
