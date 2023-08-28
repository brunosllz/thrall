import { SendNotificationUseCaseRequest } from '../use-cases/send-notification';

export class SendNotificationJob {
  constructor(readonly props: SendNotificationUseCaseRequest) {}
}
