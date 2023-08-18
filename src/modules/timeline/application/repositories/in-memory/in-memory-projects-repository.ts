import { AsyncMaybe } from '@common/logic/types/Maybe';
import { PaginationParams } from '@common/repositories/pagination-params';
import { Project } from '@modules/timeline/domain/entities/project';

import { ProjectsRepository } from '../projects-repository';

export class InMemoryProjectsRepository extends ProjectsRepository {
  items: Project[] = [];

  async findById(id: string): AsyncMaybe<Project> {
    const project = this.items.find((project) => project.id === id);

    if (!project) {
      return null;
    }

    return project;
  }

  async findManyRecent({ pageIndex, pageSize }: PaginationParams) {
    const projects = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return projects;
  }

  async findBySlug(slug: string) {
    const project = this.items.find((project) => project.slug.value === slug);

    if (!project) {
      return null;
    }

    return project;
  }

  async create(project: Project) {
    this.items.push(project);
  }

  async save(project: Project) {
    const projectUpdatedIndex = this.items.findIndex(
      (item) => project.id === item.id,
    );

    this.items[projectUpdatedIndex] = project;
  }

  async delete(project: Project) {
    const itemIndex = this.items.findIndex((item) => item.id === project.id);

    this.items.splice(itemIndex, 1);

    this.rolesRepository.deleteManyByProjectId(project.id);
  }
}
