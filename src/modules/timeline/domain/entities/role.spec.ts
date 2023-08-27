import { Role } from './role';
import { Slug } from './value-objects/slug';

describe('Role', () => {
  it('should be able to create a role', () => {
    const role = Role.create({
      name: Slug.createFromText('Front end').getValue(),
      amount: 3,
    });

    expect(role).toMatchObject({
      name: Slug.createFromText('Front end').getValue(),
      amount: 3,
    });
  });
});
