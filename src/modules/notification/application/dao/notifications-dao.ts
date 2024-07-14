import {
  PaginationParams,
  PaginationQueryResponse,
} from '@/core/repositories/pagination-params';

export abstract class NotificationsDAO {
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginationQueryResponse>;
  abstract countUnreadByUserId(userId: string): Promise<number>;
}
