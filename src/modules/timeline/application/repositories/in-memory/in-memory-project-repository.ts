import { Project } from '@modules/timeline/domain/entities/project';

import { ProjectRepository } from '../project-repository';

export class InMemoryProjectRepository extends ProjectRepository {
  items: Project[] = [];

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
  }

  async delete(project: Project) {
    const itemIndex = this.items.findIndex((item) => item.id === project.id);

    this.items.splice(itemIndex, 1);

    this.roleRepository.deleteManyByProjectId(project.id);
  }
}
