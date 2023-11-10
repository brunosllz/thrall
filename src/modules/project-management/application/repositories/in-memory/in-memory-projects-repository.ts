import { Slug } from '@/common/domain/entities/value-objects/slug';
import { DomainEvents } from '@common/domain/events/domain-events';
import { Project } from '@modules/project-management/domain/entities/project';

import { ProjectsRepository } from '../projects-repository';
export class InMemoryProjectsRepository extends ProjectsRepository {
  items: Project[] = [];

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
