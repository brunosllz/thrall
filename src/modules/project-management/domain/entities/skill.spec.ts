import { Skill } from './skill';

describe('Skill', () => {
  it('should be able to create a skill tag', () => {
    const technology = Skill.create('react');

    expect(technology.isSuccess).toBeTruthy();
    expect(technology.getValue().slug.value).toEqual('react');
  });
});
