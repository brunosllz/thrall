import { AnswerComment } from '@modules/timeline/domain/entities/answer-comment';
import { AnswerComment as RawAnswerComment } from '@prisma/client';

export class AnswerCommentMapper {
  static toDomain(raw: RawAnswerComment): AnswerComment {
    const answerComment = AnswerComment.create(
      {
        answerId: raw.answerId,
        authorId: raw.authorId,
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id,
    ).getValue();

    return answerComment;
  }

  static toPersistence(answerComment: AnswerComment): RawAnswerComment {
    return {
      answerId: answerComment.answerId,
      authorId: answerComment.authorId,
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      id: answerComment.id,
      updatedAt: answerComment.updatedAt ?? null,
    };
  }
}
