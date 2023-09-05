import { AsyncMaybe } from '@common/logic/types/Maybe';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';

import { Project } from '../../domain/entities/project';

export abstract class ProjectsRepository {
  abstract exists({
    authorId,
    slug,
  }: {
    authorId: string;
    slug: Slug;
  }): Promise<boolean>;
  abstract findById(id: string): AsyncMaybe<Project>;
  abstract create(project: Project): Promise<void>;
  abstract save(project: Project): Promise<void>;
  abstract delete(project: Project): Promise<void>;
}
