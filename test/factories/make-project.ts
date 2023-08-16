import { faker } from '@faker-js/faker';
import {
  Project,
  ProjectProps,
} from '@modules/timeline/domain/entities/project';
import { Requirement } from '@modules/timeline/domain/entities/value-objects/requirement';

type Overrides = Partial<ProjectProps>;

export function makeFakeProject(override = {} as Overrides, id?: string) {
  const project = Project.create(
    {
      authorId: faker.string.uuid(),
      content: faker.lorem.paragraphs(),
      title: faker.lorem.text(),
      requirements: Requirement.create({
        content: faker.lorem.paragraphs(),
        timeAmount: faker.number.int(),
        timeIdentifier: 'week',
      }),
      ...override,
    },
    id,
  );

  return project;
}
