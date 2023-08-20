import { AsyncMaybe } from '@common/logic/types/Maybe';
import { PaginationParams } from '@common/repositories/pagination-params';

import { Project } from '../../domain/entities/project';

export abstract class ProjectsRepository {
  abstract findById(id: string): AsyncMaybe<Project>;
  abstract findBySlug(slug: string): AsyncMaybe<Project>;
  abstract findManyRecent(params: PaginationParams): Promise<Project[]>;
  abstract create(project: Project): Promise<void>;
  abstract save(project: Project): Promise<void>;
  abstract delete(project: Project): Promise<void>;
}