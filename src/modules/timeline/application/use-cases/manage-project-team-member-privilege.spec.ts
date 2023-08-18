import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { ManageProjectTeamMemberPrivilegeUseCase } from './manage-project-team-member-privilege';

let sut: ManageProjectTeamMemberPrivilegeUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Manage project team member privilege', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new ManageProjectTeamMemberPrivilegeUseCase(projectsRepository);
  });

  it('should be able to change the privilege of a team member to owner', async () => {
    const project = makeFakeProject();
    project.teamMembers.add(
      makeFakeMember({
        recipientId: '2',
        status: 'approved',
      }),
    );

    await projectsRepository.create(project);

    const result = await sut.execute({
      ownerId: project.authorId,
      projectId: project.id,
      memberId: '2',
      permissionType: 'owner',
    });

    expect(result.isRight()).toBe(true);
    expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(2);
    expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
      expect.objectContaining({
        recipientId: project.authorId,
        permissionType: 'owner',
        status: 'approved',
      }),
      expect.objectContaining({
        recipientId: '2',
        permissionType: 'owner',
        status: 'approved',
      }),
    ]);
  });

  it('should be not able to change the privilege of a team member if non exist project', async () => {
    const result = await sut.execute({
      ownerId: '1',
      projectId: 'non-id',
      permissionType: 'member',
      memberId: '2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be not able to change the privilege of a team member if isn't a owner", async () => {
    const project = makeFakeProject();
    project.teamMembers.add(
      makeFakeMember({
        recipientId: '2',
        status: 'approved',
        permissionType: 'member',
      }),
    );

    await projectsRepository.create(project);

    const result = await sut.execute({
      ownerId: '2',
      projectId: project.id,
      memberId: '3',
      permissionType: 'owner',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be not able to change the privilege itself to member if just have a owner', async () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    await projectsRepository.create(project);

    const result = await sut.execute({
      ownerId: project.authorId,
      projectId: project.id,
      memberId: project.authorId,
      permissionType: 'member',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
