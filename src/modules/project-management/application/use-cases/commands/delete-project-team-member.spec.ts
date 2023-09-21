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
import { DeleteProjectTeamMemberUseCase } from './delete-project-team-member';

let sut: DeleteProjectTeamMemberUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Delete project team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new DeleteProjectTeamMemberUseCase(projectsRepository);
  });

  it('should be able to remove a member of team', async () => {
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

      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        2,
      );

      const result = await sut.execute({
        memberId: '2',
        ownerId: project.authorId,
        projectId: project.id,
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        1,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: project.authorId,
          permissionType: 'owner',
          status: MemberStatus.APPROVED,
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to remove a member of with non exist project id', async () => {
    let errorOccurred = false;

    try {
      const result = await sut.execute({
        ownerId: '1',
        projectId: 'non-id',
        memberId: '2',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it("should be not able to remove member of team if isn't a owner", async () => {
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
        memberId: project.authorId,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to remove itself if just have a owner', async () => {
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
        memberId: project.authorId,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
