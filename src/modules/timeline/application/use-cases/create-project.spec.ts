import { faker } from '@faker-js/faker';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';

import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository';
import { InMemoryRoleRepository } from '../repositories/in-memory/in-memory-role-repository';
import { CreateProjectUseCase } from './create-project';

let sut: CreateProjectUseCase;
let projectRepository: InMemoryProjectRepository;
let roleRepository: InMemoryRoleRepository;

describe('Create a project', () => {
  beforeEach(() => {
    roleRepository = new InMemoryRoleRepository();
    projectRepository = new InMemoryProjectRepository(roleRepository);
    sut = new CreateProjectUseCase(projectRepository);
  });

  it('should be able create a project', async () => {
    await sut.execute({
      authorId: '1',
      title: 'title example',
      content: faker.lorem.paragraphs(),
      roles: [
        {
          amount: 2,
          name: 'front-end',
        },
        {
          amount: 1,
          name: 'devops',
        },
      ],
      requirements: {
        content: faker.lorem.paragraphs(),
        timeAmount: 2,
        timeIdentifier: 'week',
      },
      technologies: [{ slug: 'react' }, { slug: 'react native' }],
    });

    expect(projectRepository.items).toHaveLength(1);
    expect(projectRepository.items[0].slug.value).toEqual('title-example');
    expect(projectRepository.items[0].roles.getItems()).toHaveLength(2);
    expect(projectRepository.items[0].roles.getItems()).toEqual([
      expect.objectContaining({
        amount: 2,
        name: 'front-end',
      }),
      expect.objectContaining({
        amount: 1,
        name: 'devops',
      }),
    ]);
    expect(projectRepository.items[0].technologies.getItems()).toHaveLength(2);
    expect(projectRepository.items[0].technologies.getItems()).toEqual([
      expect.objectContaining({ slug: Slug.createFromText('react') }),
      expect.objectContaining({ slug: Slug.createFromText('react native') }),
    ]);
    expect(projectRepository.items[0].requirements.value).toMatchObject({
      timeAmount: 2,
      timeIdentifier: 'week',
    });
  });
});
