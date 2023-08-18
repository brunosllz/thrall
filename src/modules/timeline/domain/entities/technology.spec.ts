import { Technology } from './technology';
import { Slug } from './value-objects/slug';

describe('Technology', () => {
  it('should be able to create a technology tag', () => {
    const technology = Technology.create('react');

    expect(technology.slug).toBeInstanceOf(Slug);
    expect(technology.slug.value).toEqual('react');
  });
});
