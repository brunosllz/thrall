import { AsyncMaybe } from '@common/logic/types/Maybe';
import { PaginationParams } from '@common/repositories/pagination-params';

import { Answer } from '../../domain/entities/answer';

export abstract class AnswersRepository {
  abstract findById(id: string): AsyncMaybe<Answer>;
  abstract findManyByProjectId(
    projectId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  abstract create(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
}
