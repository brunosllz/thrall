import { makeFakeProject } from '@test/factories/make-project';

import { Content } from './value-objects/content';

describe('Project', () => {
  it('should be able to create excerpt from project description', () => {
    const project = makeFakeProject({
      description: new Content('a'.repeat(200)),
    });

    const descriptionExcerpt = Content.createExcerptFromText(
      project.description.value,
      150,
    );

    expect(descriptionExcerpt.length).toBeGreaterThanOrEqual(150);
    expect(descriptionExcerpt.length).toBeLessThanOrEqual(153);
  });

  it('should be able to create a project with authorId to be default owner', () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    expect(project.teamMembers.currentItems[0]).toMatchObject({
      recipientId: '1',
      permissionType: 'owner',
    });
  });
});
