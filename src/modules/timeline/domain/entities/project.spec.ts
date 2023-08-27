import { makeFakeProject } from '@test/factories/make-project';

describe('Project', () => {
  it('should be able to create excerpt from project content', () => {
    const newProject = makeFakeProject();
    expect(newProject.isSuccess).toBeTruthy();

    const project = newProject.getValue();

    expect(project.excerpt.length).toBeGreaterThanOrEqual(120);
    expect(project.excerpt.length).toBeLessThanOrEqual(123);
  });

  it('should be able to create a project with authorId to be default owner', () => {
    const newProject = makeFakeProject({
      authorId: '1',
    });

    expect(newProject.isSuccess).toBeTruthy();

    const project = newProject.getValue();

    expect(project.teamMembers.currentItems[0]).toMatchObject({
      recipientId: '1',
      permissionType: 'owner',
    });
  });
});
