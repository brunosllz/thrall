import { DomainEvents } from '@common/domain/events/domain-events';
import { PaginationParams } from '@common/repositories/pagination-params';
import { Project } from '@modules/timeline/domain/entities/project';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';

import { ProjectsRepository } from '../projects-repository';
import { RolesRepository } from '../roles-repository';

export class InMemoryProjectsRepository extends ProjectsRepository {
  items: Project[] = [];

  constructor(private readonly rolesRepository: RolesRepository) {
    super();
  }

  async exists({ authorId, slug }: { authorId: string; slug: Slug }) {
    const hasItem = this.items.find((project) => {
      return project.authorId === authorId && project.slug.value === slug.value;
    });

    if (hasItem) {
      return true;
    }

    return false;
  }

  async findById(id: string) {
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

  async findBySlug(slug: string, authorId: string) {
    const project = this.items.find(
      (project) => project.slug.value === slug && project.authorId === authorId,
    );

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

    DomainEvents.dispatchEventsForAggregate(project.id);
  }

  async delete(project: Project) {
    const itemIndex = this.items.findIndex((item) => item.id === project.id);

    this.items.splice(itemIndex, 1);

    this.rolesRepository.deleteManyByProjectId(project.id);
  }
}
