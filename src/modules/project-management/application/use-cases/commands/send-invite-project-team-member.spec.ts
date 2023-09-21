import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { MemberStatus } from '@modules/project-management/domain/entities/member';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../../repositories/in-memory/in-memory-roles-repository';
import { SendInviteProjectTeamMemberUseCase } from './send-invite-project-team-member';

let sut: SendInviteProjectTeamMemberUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Send invite project team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new SendInviteProjectTeamMemberUseCase(projectsRepository);
  });

  it('should be able to invite a team member', async () => {
    let errorOccurred = false;
    try {
      const member = makeFakeMember({
        recipientId: '1',
      });

      const project = makeFakeProject({
        authorId: member.recipientId,
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: member.recipientId,
        projectId: project.id,
        recipientId: '2',
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        2,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: member.recipientId,
          permissionType: 'owner',
          status: MemberStatus.APPROVED,
        }),
        expect.objectContaining({
          recipientId: '2',
          permissionType: 'member',
          status: MemberStatus.PENDING,
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to invite a team member with non exist project id', async () => {
    let errorOccurred = false;
    try {
      const member = makeFakeMember({
        recipientId: '1',
      });

      const result = await sut.execute({
        ownerId: member.recipientId,
        projectId: 'non-id',
        recipientId: '2',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it("should be not able to invite a team member if have't owner permission", async () => {
    let errorOccurred = false;
    try {
      const member1 = makeFakeMember({
        recipientId: '1',
      });

      const project = makeFakeProject({
        authorId: member1.recipientId,
      });

      const member2 = makeFakeMember({
        recipientId: '2',
        status: MemberStatus.APPROVED,
      });

      project.teamMembers.add(member2);

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: member2.recipientId,
        projectId: project.id,
        recipientId: '3',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to invite a team member if not associated to project', async () => {
    let errorOccurred = false;
    try {
      const member1 = makeFakeMember({
        recipientId: '1',
      });

      const project = makeFakeProject({
        authorId: member1.recipientId,
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: '2',
        projectId: project.id,
        recipientId: '3',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
