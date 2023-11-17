import { PaginationParams } from '@common/repositories/pagination-params';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import {
  // FindManyGeneralSkillsToTheProjectsQueryParams,
  FindManyWithShortDetailsQueryParams,
  ProjectsDAO,
} from '../projects-dao';

export class InMemoryProjectsDAO extends ProjectsDAO {
  findManyGeneralSkillsToTheProjects(): // queryParams: FindManyGeneralSkillsToTheProjectsQueryParams,
  Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  constructor(readonly inMemoryProjectsRepository: InMemoryProjectsRepository) {
    super();
  }

  async findDetailsById(projectId: string): Promise<any> {
    const project = this.inMemoryProjectsRepository.items.find(
      (project) => project.id === projectId,
    );

    return project;
  }

  async findManyWithShortDetails(
    _queryParams: FindManyWithShortDetailsQueryParams,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const projects = this.inMemoryProjectsRepository.items.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug.value,
      authorId: project.authorId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    const total = this.inMemoryProjectsRepository.items.length;
    const perPage = pageSize;
    const page = pageIndex;
    const lastPage = Math.ceil(total / pageSize);

    const data = projects.slice(
      (pageIndex - 1) * pageSize,
      pageIndex * pageSize,
    );

    return { total, perPage, page, lastPage, data };
  }

  async findManyRecent({ pageIndex, pageSize }: PaginationParams) {
    const projects = this.inMemoryProjectsRepository.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    const total = this.inMemoryProjectsRepository.items.length;
    const perPage = pageSize;
    const page = pageIndex;
    const lastPage = Math.ceil(total / pageSize);
    const data = projects;

    return { total, perPage, page, lastPage, data };
  }

  async findManyByUserId(
    userId: string,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const projects = this.inMemoryProjectsRepository.items
      .filter((project) => project.authorId === userId)
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return projects;
  }

  async findBySlug(slug: string, authorId: string) {
    const project = this.inMemoryProjectsRepository.items.find(
      (project) => project.slug.value === slug && project.authorId === authorId,
    );

    return project;
  }
}
