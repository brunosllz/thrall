import { PaginationParams } from '@common/repositories/pagination-params';

export abstract class NotificationsDAO {
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<any[]>;
  abstract countUnreadByUserId(userId: string): Promise<number>;
  abstract findUserByAuthorId(authorId: string): Promise<any>;
}
