import { faker } from '@faker-js/faker';

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
      title: 'title example',
    });

    expect(projectRepository.items).toHaveLength(1);
    expect(projectRepository.items[0].slug.value).toEqual('title-example');
    expect(projectRepository.items[0].roles.getItems()).toHaveLength(2);
    //TODO: create a class then manage ids for all classes and implement validation on this class -> UUIDEntity
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
  });
});
