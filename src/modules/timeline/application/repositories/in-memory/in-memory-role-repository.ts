import { Role } from '@modules/timeline/domain/entities/role';

import { RoleRepository } from '../role-repository';

export class InMemoryRoleRepository implements RoleRepository {
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
