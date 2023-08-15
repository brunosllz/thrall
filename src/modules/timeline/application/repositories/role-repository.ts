import { Role } from '@modules/timeline/domain/entities/role';

export abstract class RoleRepository {
  abstract findManyByProjectId(projectId: string): Promise<Role[]>;
  abstract deleteManyByProjectId(projectId: string): Promise<void>;
}
