import { makeFakeProject } from '@test/factories/make-project';

import { MemberStatus } from './member';
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

  it('should be able to send an invite to a team member', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.sendInviteTeamMember(recipientId, project.authorId);

    const teamMembers = project.teamMembers.getItems();

    const newMember = teamMembers.find(
      (member) => member.recipientId === recipientId,
    );

    expect(newMember).toBeDefined();
    expect(newMember?.status).toBe(MemberStatus.PENDING);
  });

  it('should not be able to send an invite to a team member if invite is pending', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.sendInviteTeamMember(recipientId, project.authorId);
    const result = project.sendInviteTeamMember(recipientId, project.authorId);

    expect(result?.isFailure).toBe(true);
    expect(result?.error).toBe('Invite is pending');
  });

  it('should be able to add a user to the interested list', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.addInterested(recipientId);

    const interested = project.interested.getItems();

    const newInterested = interested.find(
      (interest) => interest.recipientId === recipientId,
    );

    expect(newInterested).toBeDefined();
  });

  it('should not be able to add a user to the interested list if already exists', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.addInterested(recipientId);
    const result = project.addInterested(recipientId);

    expect(result?.isFailure).toBe(true);
    expect(result?.error).toBe('It is already interested');
  });

  it('should be able to accept an invite to join the team', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.sendInviteTeamMember(recipientId, project.authorId);
    project.acceptInviteTeamMember(recipientId);

    const teamMembers = project.teamMembers.getItems();

    const member = teamMembers.find(
      (member) => member.recipientId === recipientId,
    );

    expect(member?.status).toBe(MemberStatus.APPROVED);
  });

  it('should be able to reject an invite to join the team', () => {
    const project = makeFakeProject();
    const recipientId = '123';

    project.sendInviteTeamMember(recipientId, project.authorId);
    project.rejectInviteTeamMember(recipientId);

    const teamMembers = project.teamMembers.getItems();

    const member = teamMembers.find(
      (member) => member.recipientId === recipientId,
    );

    expect(member?.status).toBe(MemberStatus.REJECTED);
  });
});
