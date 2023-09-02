import { DomainEvents } from '@common/domain/events/domain-events';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { PaginationParams } from '@common/repositories/pagination-params';
import { AnswersRepository } from '@modules/project-management/application/repositories/answers-repository';
import { Answer } from '@modules/project-management/domain/entities/answer';
import { Injectable } from '@nestjs/common';

import { AnswerMapper } from '../mappers/answer-mapper';

@Injectable()
export class PrismaAnswersRepository extends AnswersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      return null;
    }

    return AnswerMapper.toDomain(answer);
  }

  async findManyByProjectId(
    projectId: string,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const answers = await this.prisma.answer.findMany({
      where: {
        projectId,
      },
      take: pageIndex * pageSize,
      skip: (pageIndex - 1) * pageSize,
    });

    return answers.map((answer) => AnswerMapper.toDomain(answer));
  }

  async create(answer: Answer) {
    const raw = AnswerMapper.toPersistence(answer);

    await this.prisma.answer.create({
      data: raw,
    });

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const raw = AnswerMapper.toPersistence(answer);

    await this.prisma.answer.update({
      where: {
        id: raw.id,
      },
      data: {
        content: raw.content,
      },
    });
  }

  async delete(answer: Answer) {
    const raw = AnswerMapper.toPersistence(answer);

    await this.prisma.answer.delete({
      where: {
        id: raw.id,
      },
    });
  }
}
