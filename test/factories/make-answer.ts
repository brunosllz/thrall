import { PrismaService } from '@common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Answer, AnswerProps } from '@modules/timeline/domain/entities/answer';
import { AnswerMapper } from '@modules/timeline/infra/prisma/mappers/answer-mapper';
import { Injectable } from '@nestjs/common';

type Overrides = Partial<AnswerProps>;

export function makeFakeAnswer(override: Overrides = {}, id?: string) {
  const answer = Answer.create(
    {
      authorId: faker.string.uuid(),
      projectId: faker.string.uuid(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  ).getValue();

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makeAnswer(data = {} as Overrides) {
    const answer = makeFakeAnswer(data);

    await this.prisma.answer.create({
      data: AnswerMapper.toPersistence(answer),
    });

    return answer;
  }
}
