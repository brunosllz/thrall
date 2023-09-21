import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import {
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../../repositories/in-memory/in-memory-roles-repository';
import { ManageProjectTeamMemberPrivilegeError } from './errors/manage-project-team-member-privilege-error';
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
    let errorOccurred = false;
    try {
      const project = makeFakeProject();
      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.APPROVED,
        }),
      );

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        projectId: project.id,
        memberId: '2',
        permissionType: PermissionType.OWNER,
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        2,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: project.authorId,
          permissionType: 'owner',
          status: MemberStatus.APPROVED,
        }),
        expect.objectContaining({
          recipientId: '2',
          permissionType: 'owner',
          status: MemberStatus.APPROVED,
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to change the privilege of a team member if non exist project', async () => {
    let errorOccurred = false;
    try {
      const result = await sut.execute({
        ownerId: '1',
        projectId: 'non-id',
        permissionType: PermissionType.MEMBER,
        memberId: '2',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it("should be not able to change the privilege of a team member if isn't a owner", async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject();
      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.APPROVED,
          permissionType: PermissionType.MEMBER,
        }),
      );

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: '2',
        projectId: project.id,
        memberId: '3',
        permissionType: PermissionType.OWNER,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to change the privilege itself to member if just have a owner', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject({
        authorId: '1',
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        projectId: project.id,
        memberId: project.authorId,
        permissionType: PermissionType.MEMBER,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(
        ManageProjectTeamMemberPrivilegeError.InvalidDeleteItSelf,
      );
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
