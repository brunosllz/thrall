import { PaginationParams } from '@common/repositories/pagination-params';

export abstract class NotificationsDAO {
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<any[]>;
}
