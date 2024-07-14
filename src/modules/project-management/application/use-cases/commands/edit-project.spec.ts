import { Slug } from '@/core/domain/value-objects/slug';
import {
  MemberStatus,
  PermissionType,
} from '@/modules/project-management/domain/entities/member';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { faker } from '@faker-js/faker';

import { makeFakeJob } from '@test/factories/make-job';
import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { EditProjectUseCase } from './edit-project';

let sut: EditProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;

describe('Edit a projects', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new EditProjectUseCase(projectsRepository);
  });

  it('should be able edit a project', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject(
        {
          authorId: '1',
          jobs: new ProjectJobList([
            makeFakeJob(
              {
                projectId: '1',
                name: 'devops',
                jobAmountAvailable: 1,
              },
              '1',
            ),
            makeFakeJob(
              {
                projectId: '1',
                name: 'full stack',
                jobAmountAvailable: 2,
              },
              '2',
            ),
          ]),
          generalSkills: new ProjectGeneralSkillList([
            Skill.create('react').getValue(),
            Skill.create('prisma').getValue(),
          ]),
        },
        '1',
      );

      expect(project.jobs.currentItems).toHaveLength(2);
      await projectsRepository.create(project);

      await sut.execute({
        projectId: project.id,
        recipientId: '1',
        name: 'example title',
        description: 'example content',
        jobs: [
          {
            id: '1',
            name: 'front-end',
            jobAmountAvailable: 3,
            description: 'lorem',
          },
          {
            name: 'back-end',
            jobAmountAvailable: 2,
            description: faker.lorem.paragraphs(),
          },
          {
            name: 'back-end',
            jobAmountAvailable: 2,
            description: faker.lorem.paragraphs(),
          },
        ],
        generalSkills: [
          {
            slug: 'react',
          },
          {
            slug: 'javascript',
          },
          {
            slug: 'typescript',
          },
        ],
      });

      expect(projectsRepository.items[0]).toMatchObject({
        name: 'example title',
        description: {
          value: 'example content',
        },
      });
      expect(projectsRepository.items[0].jobs.getRemovedItems()).toHaveLength(
        1,
      );
      expect(projectsRepository.items[0].jobs.currentItems).toHaveLength(3);
      expect(projectsRepository.items[0].jobs.currentItems[0]).toMatchObject({
        name: 'front-end',
        slug: Slug.createFromText('front-end').getValue(),
        jobAmountAvailable: 3,
      });
      expect(
        projectsRepository.items[0].jobs.currentItems[0].description.value,
      ).toBe('lorem');

      expect(projectsRepository.items[0].jobs.currentItems[1]).toMatchObject({
        name: 'back-end',
        slug: Slug.createFromText('back-end').getValue(),
        jobAmountAvailable: 2,
      });
      expect(
        projectsRepository.items[0].generalSkills.currentItems,
      ).toHaveLength(3);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a project with non exists id', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject({
        authorId: '1',
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        projectId: 'non-id',
        recipientId: '1',
        name: 'title example',
        description: 'content example 2',
        jobs: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a project with invalid recipient id', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject();

      await projectsRepository.create(project);

      const result = await sut.execute({
        projectId: project.id,
        recipientId: 'non-id',
        name: 'title example',
        description: 'content example 2',
        jobs: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a project if member is not owner', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject(
        {
          authorId: '1',
          jobs: new ProjectJobList([
            makeFakeJob(
              {
                projectId: '1',
                name: 'devops',
                jobAmountAvailable: 1,
              },
              '1',
            ),
          ]),
        },
        '1',
      );

      project.teamMembers.add(
        makeFakeMember({
          recipientId: '2',
          status: MemberStatus.APPROVED,
          permissionType: PermissionType.MEMBER,
        }),
      );

      await projectsRepository.create(project);

      const result = await sut.execute({
        projectId: project.id,
        recipientId: '2',
        name: 'example title',
        description: 'example content',
        jobs: [
          {
            id: '1',
            name: 'front-end',
            jobAmountAvailable: 3,
            description: 'lorem',
          },
          { name: 'back-end', jobAmountAvailable: 2, description: 'lorem' },
        ],
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
