import { faker } from '@faker-js/faker';
import {
  Project,
  ProjectProps,
} from '@modules/timeline/domain/entities/project';

type Overrides = Partial<ProjectProps>;

export function makeFakeProject(override = {} as Overrides, id?: string) {
  const project = Project.create(
    {
      authorId: faker.string.uuid(),
      content: faker.lorem.paragraphs(),
      title: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return project;
}
