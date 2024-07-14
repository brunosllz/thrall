import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Injectable } from '@nestjs/common';

import { NotificationsDAO } from '../../dao/notifications-dao';

interface CountNotificationsByUserIdUseCaseRequest {
  userId: string;
}

type CountNotificationsByUserIdUseCaseResponse = Either<
  Result<void>,
  Result<number>
>;

@Injectable()
export class CountUnreadNotificationsByUserIdUseCase {
  constructor(private readonly notificationsDAO: NotificationsDAO) {}

  async execute({
    userId,
  }: CountNotificationsByUserIdUseCaseRequest): Promise<CountNotificationsByUserIdUseCaseResponse> {
    try {
      const notificationsAmount =
        await this.notificationsDAO.countUnreadByUserId(userId);

      return right(Result.ok(notificationsAmount));
    } catch (error) {
      return left(Result.fail(error));
    }
  }
}
