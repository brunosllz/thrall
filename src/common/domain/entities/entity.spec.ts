import { Entity } from './entity';

interface EntityExampleProps {
  name: string;
}

class EntityExample extends Entity<EntityExampleProps> {
  get name() {
    return this.props.name;
  }

  static create(props: EntityExampleProps) {
    const entity = new EntityExample(props);

    return entity;
  }
}

describe('Entity', () => {
  it('should be able to create a class extend entity', () => {
    const entity = EntityExample.create({ name: 'name example' });

    expect(entity.name).toEqual('name example');
    expect(entity.id).toEqual(expect.any(String));
  });
});
