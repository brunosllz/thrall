import { Slug } from '@/common/domain/entities/value-objects/slug';

import { Role } from './role';
import { Content } from './value-objects/content';

describe('Role', () => {
  it('should be able to create a role', () => {
    try {
      const role = Role.create({
        name: Slug.createFromText('Front end').getValue(),
        projectId: 'project-id',
        membersAmount: 3,
        description: new Content('Lorem ipsum dolor sit amet.'),
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
