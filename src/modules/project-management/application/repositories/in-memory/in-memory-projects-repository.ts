import { DomainEvents } from '@/core/domain/events/domain-events';
import { Slug } from '@/core/domain/value-objects/slug';
import { Project } from '@modules/project-management/domain/entities/project';

import { ProjectsRepository } from '../projects-repository';
export class InMemoryProjectsRepository extends ProjectsRepository {
  items: Project[] = [];

  async exists({ authorId, slug }) {
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
  }
}
