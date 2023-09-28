import {
  PaginationParams,
  PaginationQueryResponse,
} from '@/common/repositories/pagination-params';
import { InMemoryUsersRepository } from '@/modules/account/application/repositories/in-memory/in-memory-users-repository';

import { InMemoryNotificationsRepository } from '../../repositories/in-memory/in-memory-notifications-repository';
import { NotificationsDAO } from '../notifications-dao';

export class InMemoryNotificationsDAO implements NotificationsDAO {
  constructor(
    readonly InMemoryNotificationsRepository: InMemoryNotificationsRepository,
    readonly InMemoryUsersRepository: InMemoryUsersRepository,
  ) {}

  async findManyByUserId(
    userId: string,
    { pageIndex, pageSize }: PaginationParams,
  ): Promise<PaginationQueryResponse> {
    const notifications = this.InMemoryNotificationsRepository.items
      .filter((notification) => notification.recipientId === userId)
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return {
      page: pageIndex,
      perPage: pageSize,
      total: notifications.length,
      lastPage: Math.ceil(notifications.length / pageSize),
      data: notifications,
    };
  }
  async countUnreadByUserId(userId: string): Promise<number> {
    const countUnreadNotifications =
      this.InMemoryNotificationsRepository.items.filter(
        (Notification) =>
          Notification.recipientId === userId && Notification.read === null,
      ).length;

    return countUnreadNotifications;
  }

  async findUserByAuthorId(authorId: string) {
    const user = this.InMemoryUsersRepository.items.find(
      (user) => user.id === authorId,
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
