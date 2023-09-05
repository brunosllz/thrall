import { PaginationParams } from '@common/repositories/pagination-params';

export abstract class ProjectsDAO {
  abstract findManyRecent(params: PaginationParams): Promise<any[]>;
  abstract findBySlug(slug: string, authorId: string): Promise<any>;
}
