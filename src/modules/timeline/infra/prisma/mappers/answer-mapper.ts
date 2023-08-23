import { Answer } from '@modules/timeline/domain/entities/answer';
import { Answer as RawAnswer } from '@prisma/client';

export class AnswerMapper {
  static toDomain(raw: RawAnswer): Answer {
    const answer = Answer.create(
      {
        authorId: raw.authorId,
        content: raw.content,
        projectId: raw.projectId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id,
    );

    return answer;
  }

  static toPersistence(answer: Answer): RawAnswer {
    return {
      authorId: answer.authorId,
      content: answer.content,
      projectId: answer.projectId,
      createdAt: answer.createdAt,
      id: answer.id,
      updatedAt: answer.updatedAt ?? null,
    };
  }
}
