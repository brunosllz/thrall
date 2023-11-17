import {
  PaginationParams,
  PaginationQueryResponse,
} from '@common/repositories/pagination-params';

export type FindManyWithShortDetailsQueryParams = {
  roles: string[];
  skills: string[];
  date: string;
};

export type FindManyGeneralSkillsToTheProjectsQueryParams = {
  search?: string;
};

export abstract class ProjectsDAO {
  abstract findDetailsById(projectId: string): Promise<any>;
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<any[]>;
  abstract findBySlug(slug: string, authorId: string): Promise<any>;
  abstract findManyWithShortDetails(
    queryParams: FindManyWithShortDetailsQueryParams,
    paginationParams: PaginationParams,
  ): Promise<PaginationQueryResponse>;
  abstract findManyGeneralSkillsToTheProjects(
    queryParams: FindManyGeneralSkillsToTheProjectsQueryParams,
  ): Promise<any[]>;
}
