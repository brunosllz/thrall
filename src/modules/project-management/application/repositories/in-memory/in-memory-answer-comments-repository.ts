import { DomainEvents } from '@common/domain/events/domain-events';
import { PaginationParams } from '@common/repositories/pagination-params';
import { AnswerComment } from '@modules/project-management/domain/entities/answer-comment';

import { AnswerCommentsRepository } from '../answer-comments-repository';

export class InMemoryAnswerCommentsRepository extends AnswerCommentsRepository {
  items: AnswerComment[] = [];

  async findById(id: string) {
    const AnswerComment = this.items.find((answer) => answer.id === id);

    if (!AnswerComment) {
      return null;
    }

    return AnswerComment;
  }

  async findManyByAnswerId(
    answerId: string,
    { pageIndex, pageSize }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId === answerId)
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async save(answerComment: AnswerComment) {
    const answerUpdatedIndex = this.items.findIndex(
      (item) => answerComment.id === item.id,
    );

    this.items[answerUpdatedIndex] = answerComment;
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
