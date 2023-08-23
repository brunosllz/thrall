import { faker } from '@faker-js/faker';
import { TimeIdentifier } from '@modules/timeline/domain/entities/value-objects/requirement';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';

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
    await sut.execute({
      authorId: '1',
      title: 'title example',
      content: faker.lorem.paragraphs(),
      roles: [
        {
          amount: 2,
          name: 'front end',
        },
        {
          amount: 1,
          name: 'devops',
        },
      ],
      requirements: {
        content: faker.lorem.paragraphs(),
        timeAmount: 2,
        timeIdentifier: TimeIdentifier.WEEK,
      },
      technologies: [{ slug: 'react' }, { slug: 'react native' }],
    });

    expect(projectsRepository.items).toHaveLength(1);
    expect(projectsRepository.items[0].slug.value).toEqual('title-example');
    expect(projectsRepository.items[0].roles.getItems()).toHaveLength(2);
    expect(projectsRepository.items[0].roles.getItems()).toEqual([
      expect.objectContaining({
        amount: 2,
        name: Slug.createFromText('front end'),
      }),
      expect.objectContaining({
        amount: 1,
        name: Slug.createFromText('devops'),
      }),
    ]);
    expect(projectsRepository.items[0].technologies.getItems()).toHaveLength(2);
    expect(projectsRepository.items[0].technologies.getItems()).toEqual([
      expect.objectContaining({ slug: Slug.createFromText('react') }),
      expect.objectContaining({ slug: Slug.createFromText('react native') }),
    ]);
    expect(projectsRepository.items[0].requirements.value).toMatchObject({
      timeAmount: 2,
      timeIdentifier: TimeIdentifier.WEEK,
    });
  });
});
