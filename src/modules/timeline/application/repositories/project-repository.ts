import { Project } from '../../domain/entities/project';
import { RoleRepository } from './role-repository';

export abstract class ProjectRepository {
  constructor(protected readonly roleRepository: RoleRepository) {}

  abstract create(project: Project): Promise<void>;
  abstract save(project: Project): Promise<void>;
  abstract delete(project: Project): Promise<void>;
  abstract findById(id: string): Promise<Project | null>;
}
