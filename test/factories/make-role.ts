import { faker } from '@faker-js/faker';
import {
  Role,
  RoleProps,
} from '@modules/project-management/domain/entities/role';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';

type Overrides = Partial<RoleProps>;

export function makeFakeRole(override = {} as Overrides, id?: string) {
  const role = Role.create(
    {
      membersAmount: faker.number.int(),
      name: Slug.createFromText(faker.person.jobTitle()).getValue(),
      projectId: faker.string.uuid(),
      ...override,
    },
    id,
  ).getValue();

  return role;
}
