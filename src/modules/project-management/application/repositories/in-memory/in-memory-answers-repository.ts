import { DomainEvents } from '@common/domain/events/domain-events';
import { PaginationParams } from '@common/repositories/pagination-params';
import { Answer } from '@modules/project-management/domain/entities/answer';

import { AnswersRepository } from '../answers-repository';

export class InMemoryAnswersRepository extends AnswersRepository {
  items: Answer[] = [];

  async findManyByProjectId(
    projectId: string,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const answers = this.items
      .filter((item) => item.projectId === projectId)
      .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return answers;
  }

  async findById(id: string) {
    const answer = this.items.find((answer) => answer.id === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const answerUpdatedIndex = this.items.findIndex(
      (item) => answer.id === item.id,
    );

    this.items[answerUpdatedIndex] = answer;
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);
  }
}
