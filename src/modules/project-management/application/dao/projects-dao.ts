import {
  PaginationParams,
  PaginationQueryResponse,
} from '@/core/repositories/pagination-params';

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
    paginationParams: PaginationParams,
  ): Promise<PaginationQueryResponse>;
  abstract findManyInvolvedByUserId(
    userId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationQueryResponse>;
  abstract findBySlug(slug: string): Promise<any>;
  abstract findManyWithShortDetails(
    queryParams: FindManyWithShortDetailsQueryParams,
    paginationParams: PaginationParams,
  ): Promise<PaginationQueryResponse>;
  abstract findManyGeneralSkillsToTheProjects(
    queryParams: FindManyGeneralSkillsToTheProjectsQueryParams,
  ): Promise<any[]>;
}
