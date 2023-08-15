import { makeFakeProject } from '@test/factories/make-project';

describe('Project', () => {
  it('should be able to create a project', () => {
    const post = makeFakeProject();

    expect(post.id).toEqual(expect.any(String));
  });

  it('should be able to create excerpt from project content', () => {
    const post = makeFakeProject();

    expect(post.excerpt.length).toBeGreaterThanOrEqual(120);
    expect(post.excerpt.length).toBeLessThanOrEqual(123);
  });
});
