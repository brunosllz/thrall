import {
  PaginationParams,
  PaginationQueryResponse,
} from '@common/repositories/pagination-params';

export type ProjectQueryParams = {
  roles: string[];
  skills: string[];
  date: string;
};

export abstract class ProjectsDAO {
  abstract findDetailsById(projectId: string): Promise<any>;
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<any[]>;
  abstract findBySlug(slug: string, authorId: string): Promise<any>;
  abstract findManyWithShortDetails(
    queryParams: ProjectQueryParams,
    paginationParams: PaginationParams,
  ): Promise<PaginationQueryResponse>;
}
