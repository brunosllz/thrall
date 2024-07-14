import { Entity } from './entity';
import { UniqueID } from './unique-id';

interface EntityExampleProps {
  name: string;
}

class EntityExample extends Entity<EntityExampleProps> {
  get name() {
    return this.props.name;
  }

  static create(props: EntityExampleProps, id?: UniqueID) {
    const entity = new EntityExample(props, 'EX', id);

    return entity;
  }
}

describe('Entity', () => {
  it('should be able to create a class extend entity', () => {
    const entity = EntityExample.create({ name: 'name example' });

    expect(entity.name).toEqual('name example');
    expect(entity.id).instanceOf(UniqueID);
    expect(entity.id.toString()).contain('EX');
  });
});
