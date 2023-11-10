import { Slug } from '@/common/domain/entities/value-objects/slug';
import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { faker } from '@faker-js/faker';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { CreateProjectUseCase } from './create-project';

let sut: CreateProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;

describe('Create a projects', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new CreateProjectUseCase(projectsRepository);
  });

  it('should be able create a projects', async () => {
    let errorOccurred = false;

    try {
      const result = await sut.execute({
        authorId: '1',
        name: 'title example',
        description: faker.lorem.paragraphs(),
        imageUrl: faker.image.url(),
        status: ProjectStatus.RECRUITING,
        roles: [
          {
            membersAmount: 2,
            name: 'front end',
            description: faker.lorem.paragraphs(),
          },
          {
            membersAmount: 1,
            name: 'devops',
            description: faker.lorem.paragraphs(),
          },
        ],
        availableToParticipate: {
          availableDays: [1, 3, 5],
          availableTime: {
            unit: UnitTimeType.HOUR,
            value: 2,
          },
        },
        generalSkills: [{ slug: 'react' }, { slug: 'react native' }],
      });

      expect(result.isRight()).toBeTruthy();
      expect(projectsRepository.items).toHaveLength(1);
      expect(projectsRepository.items[0].slug.value).toEqual('title-example');
      expect(projectsRepository.items[0].roles.getItems()).toHaveLength(2);
      expect(projectsRepository.items[0].roles.getItems()).toEqual([
        expect.objectContaining({
          membersAmount: 2,
          name: Slug.createFromText('front end').getValue(),
        }),
        expect.objectContaining({
          membersAmount: 1,
          name: Slug.createFromText('devops').getValue(),
        }),
      ]);
      expect(projectsRepository.items[0].generalSkills.getItems()).toHaveLength(
        2,
      );
      expect(projectsRepository.items[0].generalSkills.getItems()).toEqual([
        expect.objectContaining({
          slug: Slug.createFromText('react').getValue(),
        }),
        expect.objectContaining({
          slug: Slug.createFromText('react native').getValue(),
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to create a project if author has another project with same title', async () => {
    let errorOccurred = false;
    try {
      await sut.execute({
        authorId: '1',
        name: 'title example',
        description: faker.lorem.paragraphs(),
        imageUrl: faker.image.url(),
        status: ProjectStatus.RECRUITING,
        roles: [
          {
            membersAmount: 2,
            name: 'front end',
            description: faker.lorem.paragraphs(),
          },
          {
            membersAmount: 1,
            name: 'devops',
            description: faker.lorem.paragraphs(),
          },
        ],
        availableToParticipate: {
          availableDays: [1, 3, 5],
          availableTime: {
            unit: UnitTimeType.HOUR,
            value: 2,
          },
        },
        generalSkills: [{ slug: 'react' }, { slug: 'react native' }],
      });

      const result = await sut.execute({
        authorId: '1',
        name: 'title example',
        description: faker.lorem.paragraphs(),
        imageUrl: faker.image.url(),
        status: ProjectStatus.RECRUITING,
        roles: [
          {
            membersAmount: 2,
            name: 'front end',
            description: faker.lorem.paragraphs(),
          },
          {
            membersAmount: 1,
            name: 'devops',
            description: faker.lorem.paragraphs(),
          },
        ],
        availableToParticipate: {
          availableDays: [1, 3, 5],
          availableTime: {
            unit: UnitTimeType.HOUR,
            value: 2,
          },
        },
        generalSkills: [{ slug: 'react' }, { slug: 'react native' }],
      });

      expect(result.isLeft()).toBeTruthy();
      expect(projectsRepository.items).toHaveLength(1);
      expect(result.value).toBeInstanceOf(AlreadyExistsError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
