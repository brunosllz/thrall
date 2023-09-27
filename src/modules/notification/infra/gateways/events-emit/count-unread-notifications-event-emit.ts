interface CountUnreadNotificationsEventEmitPayload {
  count: number;
}

export class CountUnreadNotificationsEventEmit {
  constructor(readonly payload: CountUnreadNotificationsEventEmitPayload) {}
}
