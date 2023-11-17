import { Skill } from './skill';

describe('Skill', () => {
  it('should be able to create a skill tag', () => {
    const skill = Skill.create('react');

    expect(skill.isSuccess).toBeTruthy();
    expect(skill.getValue().slug.value).toEqual('react');
  });
});
