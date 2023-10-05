import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { MemberStatus } from '@modules/project-management/domain/entities/member';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../../repositories/in-memory/in-memory-roles-repository';
import { RemoveRejectedInviteTeamMemberUseCase } from './remove-rejected-invite-team-member';

let sut: RemoveRejectedInviteTeamMemberUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Remove rejected invite team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new RemoveRejectedInviteTeamMemberUseCase(projectsRepository);
  });

  it('should be able remove a team member when rejected an invite', async () => {
    let errorOccurred = false;

    try {
      const member1 = makeFakeMember({
        recipientId: '1',
      });

      const member2 = makeFakeMember({
        recipientId: '2',
        status: MemberStatus.REJECTED,
      });

      const project = makeFakeProject({
        authorId: member1.recipientId,
      });

      project.teamMembers.add(member2);

      await projectsRepository.create(project);

      const result = await sut.execute({
        projectId: project.id,
        recipientId: '2',
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        1,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: member1.recipientId,
          permissionType: 'owner',
          status: MemberStatus.APPROVED,
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to remove a team member with non exist project id', async () => {
    let errorOccurred = false;
    try {
      const member = makeFakeMember({
        recipientId: '1',
      });

      const result = await sut.execute({
        projectId: 'non-id',
        recipientId: member.id,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
