import { faker } from '@faker-js/faker';
import { Answer, AnswerProps } from '@modules/timeline/domain/entities/answer';

export function makeFakeAnswer(
  override: Partial<AnswerProps> = {},
  id?: string,
) {
  const answer = Answer.create(
    {
      authorId: faker.string.uuid(),
      projectId: faker.string.uuid(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}
