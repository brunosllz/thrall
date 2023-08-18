import { faker } from '@faker-js/faker';
import { Role, RoleProps } from '@modules/timeline/domain/entities/role';

type Overrides = Partial<RoleProps>;

export function makeFakeRole(override = {} as Overrides, id?: string) {
  const role = Role.create(
    {
      amount: faker.number.int(),
      name: faker.person.jobTitle(),
      projectId: faker.string.uuid(),
      ...override,
    },
    id,
  );

  return role;
}
