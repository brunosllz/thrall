import { AsyncMaybe } from '@common/logic/types/Maybe';
import { PaginationParams } from '@common/repositories/pagination-params';
import { AnswerComment } from '@modules/project-management/domain/entities/answer-comment';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): AsyncMaybe<AnswerComment>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
  abstract save(answerComment: AnswerComment): Promise<void>;
}
