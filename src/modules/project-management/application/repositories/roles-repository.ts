import { Role } from '@modules/project-management/domain/entities/role';

export abstract class RolesRepository {
  abstract findManyByProjectId(projectId: string): Promise<Role[]>;
  abstract deleteManyByProjectId(projectId: string): Promise<void>;
}
