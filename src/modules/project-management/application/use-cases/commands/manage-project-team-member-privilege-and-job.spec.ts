import { MembersIdsAssignedList } from '@/modules/project-management/domain/entities/watched-lists/members-ids-assigned-list';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import {
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';

import { makeFakeJob } from '@test/factories/make-job';
import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { ManageProjectTeamMemberPrivilegeAndJobError } from './errors/manage-project-team-member-privilege-and-job-error';
import { ManageProjectTeamMemberPrivilegeAndJobUseCase } from './manage-project-team-member-privilege-and-job';

let sut: ManageProjectTeamMemberPrivilegeAndJobUseCase;
let projectsRepository: InMemoryProjectsRepository;

describe('Manage project team member privilege and job', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new ManageProjectTeamMemberPrivilegeAndJobUseCase(projectsRepository);
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
        jobsId: [],
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
        jobsId: [],
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
      const project = makeFakeProject({
        authorId: '1',
      });

      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.APPROVED,
          permissionType: PermissionType.MEMBER,
        }),
      );

      project.teamMembers.add(
        makeFakeMember({
          recipientId: '3',
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
        jobsId: [],
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
        jobsId: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(
        ManageProjectTeamMemberPrivilegeAndJobError.InvalidDeleteItSelf,
      );
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to change the privilege of a member than not is approved', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject({
        authorId: '1',
      });

      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.PENDING,
          permissionType: PermissionType.MEMBER,
        }),
      );

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        projectId: project.id,
        memberId: '2',
        permissionType: PermissionType.OWNER,
        jobsId: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to assign member to a job', async () => {
    let errorOccurred = false;
    try {
      const project = makeFakeProject({
        jobs: new ProjectJobList([makeFakeJob({}, '1')]),
      });
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
        permissionType: PermissionType.MEMBER,
        memberId: '2',
        jobsId: ['1'],
      });

      const job = projectsRepository.items[0].jobs
        .getItems()
        .find((job) => job.id === '1');

      const membersIdsAssigned = job?.membersIdsAssigned.getItems();

      expect(result.isRight()).toBe(true);
      expect(membersIdsAssigned).contains('2');
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to remove member from a job', async () => {
    let errorOccurred = false;
    try {
      const project = makeFakeProject({
        jobs: new ProjectJobList([
          makeFakeJob(
            {
              jobAmountAvailable: 2,
              membersIdsAssigned: new MembersIdsAssignedList(['2']),
            },
            '1',
          ),
          makeFakeJob(
            {
              jobAmountAvailable: 2,
              membersIdsAssigned: new MembersIdsAssignedList(['2']),
            },
            '2',
          ),
        ]),
      });

      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.APPROVED,
        }),
      );

      await projectsRepository.create(project);

      expect(
        projectsRepository.items[0].jobs
          .getItems()[0]
          .membersIdsAssigned.getItems(),
      ).toContain('2');
      expect(
        projectsRepository.items[0].jobs
          .getItems()[1]
          .membersIdsAssigned.getItems(),
      ).toContain('2');

      const result = await sut.execute({
        ownerId: project.authorId,
        projectId: project.id,
        permissionType: PermissionType.MEMBER,
        memberId: '2',
        jobsId: ['1'],
      });

      expect(result.isRight()).toBe(true);
      expect(
        projectsRepository.items[0].jobs
          .getItems()[0]
          .membersIdsAssigned.getItems(),
      ).contains('2');
      expect(
        projectsRepository.items[0].jobs
          .getItems()[1]
          .membersIdsAssigned.getItems(),
      ).toHaveLength(0);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to change privilege and assign member to a job', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject({
        jobs: new ProjectJobList([
          makeFakeJob(
            {
              jobAmountAvailable: 2,
            },
            '1',
          ),
        ]),
      });

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
        jobsId: ['1'],
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
      expect(
        projectsRepository.items[0].jobs
          .getItems()[0]
          .membersIdsAssigned.getItems(),
      ).toHaveLength(1);
      expect(
        projectsRepository.items[0].jobs
          .getItems()[0]
          .membersIdsAssigned.getItems(),
      ).contains('2');
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
