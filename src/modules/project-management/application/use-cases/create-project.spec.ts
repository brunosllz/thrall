import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { faker } from '@faker-js/faker';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import { PeriodIdentifier } from '@modules/project-management/domain/entities/value-objects/requirement';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { CreateProjectUseCase } from './create-project';

let sut: CreateProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Create a projects', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
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
          },
          {
            membersAmount: 1,
            name: 'devops',
          },
        ],
        requirement: {
          content: faker.lorem.paragraphs(),
          periodAmount: 2,
          periodIdentifier: PeriodIdentifier.WEEK,
        },
        technologies: [{ slug: 'react' }, { slug: 'react native' }],
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
      expect(projectsRepository.items[0].technologies.getItems()).toHaveLength(
        2,
      );
      expect(projectsRepository.items[0].technologies.getItems()).toEqual([
        expect.objectContaining({
          slug: Slug.createFromText('react').getValue(),
        }),
        expect.objectContaining({
          slug: Slug.createFromText('react native').getValue(),
        }),
      ]);
      expect(projectsRepository.items[0].requirement.value).toMatchObject({
        periodAmount: 2,
        periodIdentifier: PeriodIdentifier.WEEK,
      });
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
          },
          {
            membersAmount: 1,
            name: 'devops',
          },
        ],
        requirement: {
          content: faker.lorem.paragraphs(),
          periodAmount: 2,
          periodIdentifier: PeriodIdentifier.WEEK,
        },
        technologies: [{ slug: 'react' }, { slug: 'react native' }],
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
          },
          {
            membersAmount: 1,
            name: 'devops',
          },
        ],
        requirement: {
          content: faker.lorem.paragraphs(),
          periodAmount: 2,
          periodIdentifier: PeriodIdentifier.WEEK,
        },
        technologies: [{ slug: 'react' }, { slug: 'react native' }],
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
