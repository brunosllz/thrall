import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { PaginationQueryResponse } from '@/core/repositories/pagination-params';
import { Injectable } from '@nestjs/common';

import { NotificationsDAO } from '../../dao/notifications-dao';

interface FetchNotificationsByUserIdUseCaseRequest {
  userId: string;
  pageIndex: number;
  pageSize: number;
}

type FetchNotificationsByUserIdUseCaseResponse = Either<
  Result<void>,
  Result<PaginationQueryResponse>
>;

@Injectable()
export class FetchNotificationsByUserIdUseCase {
  constructor(private readonly notificationsDAO: NotificationsDAO) {}

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
      return left(Result.fail(error));
    }
  }
}
