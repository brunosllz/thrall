import { PrismaService } from '@common/infra/prisma/prisma.service';
import { PaginationParams } from '@common/repositories/pagination-params';
import { AnswerCommentsRepository } from '@modules/timeline/application/repositories/answer-comments-repository';
import { AnswerComment } from '@modules/timeline/domain/entities/answer-comment';
import { Injectable } from '@nestjs/common';

import { AnswerCommentMapper } from '../mappers/answer-comment-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository extends AnswerCommentsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string) {
    const answerComment = await this.prisma.answerComment.findUnique({
      where: { id },
    });

    if (!answerComment) {
      return null;
    }

    return AnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const answerComments = await this.prisma.answerComment.findMany({
      where: {
        answerId,
      },
      take: pageIndex * pageSize,
      skip: (pageIndex - 1) * pageSize,
    });

    return answerComments.map((answerComment) =>
      AnswerCommentMapper.toDomain(answerComment),
    );
  }

  async create(answerComment: AnswerComment) {
    const raw = AnswerCommentMapper.toPersistence(answerComment);

    await this.prisma.answerComment.create({
      data: raw,
    });
  }

  async save(answerComment: AnswerComment) {
    const raw = AnswerCommentMapper.toPersistence(answerComment);

    await this.prisma.answerComment.update({
      where: {
        id: raw.id,
      },
      data: {
        content: raw.content,
      },
    });
  }

  async delete(answerComment: AnswerComment) {
    const raw = AnswerCommentMapper.toPersistence(answerComment);

    await this.prisma.answerComment.delete({
      where: {
        id: raw.id,
      },
    });
  }
}
