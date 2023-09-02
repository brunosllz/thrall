import { Technology } from './technology';

describe('Technology', () => {
  it('should be able to create a technology tag', () => {
    const technology = Technology.create('react');

    expect(technology.isSuccess).toBeTruthy();
    expect(technology.getValue().slug.value).toEqual('react');
  });
});
