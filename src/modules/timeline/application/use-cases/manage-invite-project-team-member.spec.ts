import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { MemberStatus } from '@modules/timeline/domain/entities/member';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { ManageInviteProjectTeamMemberUseCase } from './manage-invite-project-team-member';

let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;
let sut: ManageInviteProjectTeamMemberUseCase;

describe('Manage invite project team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new ManageInviteProjectTeamMemberUseCase(projectsRepository);
  });

  it('should be able to accept a invite', async () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    project.teamMembers.add(
      makeFakeMember({
        recipientId: '2',
        status: MemberStatus.PENDING,
      }),
    );

    await projectsRepository.create(project);

    const result = await sut.execute({
      memberId: '2',
      projectId: project.id,
      status: 'accepted',
    });

    expect(result.isRight()).toBe(true);
    expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(2);
    expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
      expect.objectContaining({
        recipientId: '1',
        permissionType: 'owner',
        status: 'approved',
      }),
      expect.objectContaining({
        recipientId: '2',
        permissionType: 'member',
        status: 'approved',
      }),
    ]);
  });

  it('should be able to reject a invite', async () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    project.teamMembers.add(
      makeFakeMember({
        recipientId: '2',
        status: MemberStatus.PENDING,
      }),
    );

    await projectsRepository.create(project);

    const result = await sut.execute({
      memberId: '2',
      projectId: project.id,
      status: 'rejected',
    });

    expect(result.isRight()).toBe(true);
    expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(2);
    expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
      expect.objectContaining({
        recipientId: '1',
        permissionType: 'owner',
        status: 'approved',
      }),
      expect.objectContaining({
        recipientId: '2',
        permissionType: 'member',
        status: 'rejected',
      }),
    ]);
  });

  it('should be not able to manage a invite with non exist project id', async () => {
    const result = await sut.execute({
      memberId: '2',
      projectId: 'non-id',
      status: 'accepted',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be not able to manage invite if member not have a invite', async () => {
    const project = makeFakeProject();

    projectsRepository.create(project);

    const result = await sut.execute({
      memberId: '2',
      projectId: project.id,
      status: 'accepted',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be not able to manage invite if member not have a pending invite status on project', async () => {
    const project = makeFakeProject();

    project.teamMembers.add(
      makeFakeMember({
        recipientId: '2',
        status: MemberStatus.REJECTED,
      }),
    );

    projectsRepository.create(project);

    const result = await sut.execute({
      memberId: '2',
      projectId: project.id,
      status: 'accepted',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
