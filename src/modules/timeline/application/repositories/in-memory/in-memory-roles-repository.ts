import { Role } from '@modules/timeline/domain/entities/role';

import { RolesRepository } from '../roles-repository';

export class InMemoryRolesRepository implements RolesRepository {
  items: Role[] = [];

  async deleteManyByProjectId(projectId: string) {
    const roles = this.items.filter((item) => item.projectId !== projectId);

    this.items = roles;
  }

  async findManyByProjectId(projectId: string) {
    const roles = this.items.filter((item) => item.projectId === projectId);

    return roles;
  }
}
