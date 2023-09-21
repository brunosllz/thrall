import { Either, left, right } from '@/common/logic/either';
import { Result } from '@/common/logic/result';

import { NotificationsDAO } from '../../dao/notifications-dao';

interface FetchNotificationsByUserIdUseCaseRequest {
  userId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchNotificationsByUserIdUseCaseResponse = Either<
  Result<void>,
  Result<any[]>
>;

export class FetchNotificationsByUserIdUseCase {
  constructor(private notificationsDAO: NotificationsDAO) {}

  async execute({
    userId,
    pageIndex,
    pageSize,
  }: FetchNotificationsByUserIdUseCaseRequest): Promise<FetchNotificationsByUserIdUseCaseResponse> {
    try {
      const notifications = await this.notificationsDAO.findManyByUserId(
        userId,
        {
          pageIndex,
          pageSize,
        },
      );

      return right(Result.ok(notifications));
    } catch (error) {
      return left(Result.fail<any>(error));
    }
  }
}
