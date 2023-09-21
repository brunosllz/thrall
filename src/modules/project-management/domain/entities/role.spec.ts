import { Role } from './role';
import { Slug } from './value-objects/slug';

describe('Role', () => {
  it('should be able to create a role', () => {
    try {
      const role = Role.create({
        name: Slug.createFromText('Front end').getValue(),
        projectId: 'project-id',
        membersAmount: 3,
      });

      expect(role.getValue()).toMatchObject({
        name: Slug.createFromText('Front end').getValue(),
        membersAmount: 3,
      });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
