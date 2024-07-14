import {
  Interested,
  InterestedStatus,
} from '@/modules/project-management/domain/entities/interested';
import { ProjectInterestedList } from '@/modules/project-management/domain/entities/watched-lists/project-interested-list';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { ManageInterestInParticipateProjectUseCase } from './manage-interest-in-participate-project';

let projectsRepository: InMemoryProjectsRepository;

let sut: ManageInterestInParticipateProjectUseCase;

describe('Manage interest in participate project', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new ManageInterestInParticipateProjectUseCase(projectsRepository);
  });

  it('should be able to accept a user interested in participate project', async () => {
    let errorOccurred = false;

    try {
      const INTERESTED_USER_ID = '2';

      const project = makeFakeProject({
        authorId: '1',
        interested: new ProjectInterestedList([
          Interested.create({ recipientId: INTERESTED_USER_ID }).getValue(),
        ]),
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        userId: INTERESTED_USER_ID,
        projectId: project.id,
        status: InterestedStatus.APPROVED,
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        2,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: project.authorId,
          permissionType: 'owner',
          status: 'approved',
        }),
        expect.objectContaining({
          recipientId: INTERESTED_USER_ID,
          permissionType: 'member',
          status: 'approved',
        }),
      ]);
      expect(projectsRepository.items[0].interested.getItems()).toHaveLength(1);
      expect(
        projectsRepository.items[0].interested.getItems()[0].status,
      ).toEqual(InterestedStatus.APPROVED);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to reject a user interested in participate project', async () => {
    let errorOccurred = false;

    try {
      const INTERESTED_USER_ID = '2';

      const project = makeFakeProject({
        authorId: '1',
        interested: new ProjectInterestedList([
          Interested.create({ recipientId: INTERESTED_USER_ID }).getValue(),
        ]),
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        userId: INTERESTED_USER_ID,
        projectId: project.id,
        status: InterestedStatus.REJECTED,
      });

      expect(result.isRight()).toBe(true);
      expect(projectsRepository.items[0].teamMembers.getItems()).toHaveLength(
        1,
      );
      expect(projectsRepository.items[0].teamMembers.getItems()).toEqual([
        expect.objectContaining({
          recipientId: project.authorId,
          permissionType: 'owner',
          status: 'approved',
        }),
      ]);
      expect(projectsRepository.items[0].interested.getItems()).toHaveLength(1);
      expect(
        projectsRepository.items[0].interested.getItems()[0].status,
      ).toEqual(InterestedStatus.REJECTED);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to manage a interested user with non exist project id', async () => {
    let errorOccurred = false;

    try {
      const INTERESTED_USER_ID = '2';

      const project = makeFakeProject({
        authorId: '1',
        interested: new ProjectInterestedList([
          Interested.create({ recipientId: INTERESTED_USER_ID }).getValue(),
        ]),
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        userId: INTERESTED_USER_ID,
        projectId: 'non-id',
        status: InterestedStatus.REJECTED,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to manage non interested user', async () => {
    let errorOccurred = false;

    try {
      const INTERESTED_USER_ID = '2';

      const project = makeFakeProject({
        authorId: '1',
        interested: new ProjectInterestedList([
          Interested.create({ recipientId: INTERESTED_USER_ID }).getValue(),
        ]),
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: project.authorId,
        userId: 'non-id',
        projectId: project.id,
        status: InterestedStatus.REJECTED,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to manage a interested user if not a project owner', async () => {
    let errorOccurred = false;

    try {
      const INTERESTED_USER_ID = '2';

      const project = makeFakeProject({
        authorId: '1',
        interested: new ProjectInterestedList([
          Interested.create({ recipientId: INTERESTED_USER_ID }).getValue(),
        ]),
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        ownerId: '3',
        userId: INTERESTED_USER_ID,
        projectId: project.id,
        status: InterestedStatus.APPROVED,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
