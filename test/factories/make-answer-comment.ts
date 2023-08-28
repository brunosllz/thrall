import { faker } from '@faker-js/faker';
import {
  AnswerComment,
  AnswerCommentProps,
} from '@modules/timeline/domain/entities/answer-comment';

export function makeFakeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: string,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: faker.string.uuid(),
      answerId: faker.string.uuid(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  ).getValue();

  return answerComment;
}
