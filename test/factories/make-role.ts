import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Content } from '@/modules/project-management/domain/entities/value-objects/content';
import { faker } from '@faker-js/faker';
import {
  Role,
  RoleProps,
} from '@modules/project-management/domain/entities/role';

type Overrides = Partial<RoleProps>;

export function makeFakeRole(override = {} as Overrides, id?: string) {
  const role = Role.create(
    {
      membersAmount: faker.number.int(),
      name: Slug.createFromText(faker.person.jobTitle()).getValue(),
      projectId: faker.string.uuid(),
      description: new Content(faker.lorem.paragraphs()),
      ...override,
    },
    id,
  ).getValue();

  return role;
}
