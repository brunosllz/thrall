import { Role } from './role';
import { Slug } from './value-objects/slug';

describe('Role', () => {
  it('should be able to create a role', () => {
    const role = Role.create({
      projectId: '1',
      name: Slug.createFromText('Front end'),
      amount: 3,
    });

    expect(role).toMatchObject({
      projectId: '1',
      name: 'Front-end',
      amount: 3,
    });
  });
});
