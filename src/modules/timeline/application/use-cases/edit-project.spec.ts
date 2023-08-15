import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';
import { makeFakeRole } from '@test/factories/make-role';

import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository';
import { InMemoryRoleRepository } from '../repositories/in-memory/in-memory-role-repository';
import { EditProjectUseCase } from './edit-project';

let sut: EditProjectUseCase;
let projectRepository: InMemoryProjectRepository;
let roleRepository: InMemoryRoleRepository;

describe('Edit a project', () => {
  beforeEach(() => {
    roleRepository = new InMemoryRoleRepository();
    projectRepository = new InMemoryProjectRepository(roleRepository);
    roleRepository = new InMemoryRoleRepository();
    sut = new EditProjectUseCase(projectRepository, roleRepository);
  });

  it('should be able edit a project', async () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    await projectRepository.create(project);

    roleRepository.items.push(
      makeFakeRole(
        {
          name: 'devops',
          projectId: project.id,
          amount: 1,
        },
        '1',
      ),
    );

    await sut.execute({
      projectId: project.id,
      authorId: '1',
      title: 'example title',
      content: 'example content',
      roles: [
        { id: '1', name: 'front-end', amount: 3 },
        { name: 'back-end', amount: 2 },
      ],
    });

    expect(projectRepository.items[0]).toMatchObject({
      title: 'example title',
      content: 'example content',
    });
    expect(projectRepository.items[0].roles.currentItems).toHaveLength(2);
    expect(projectRepository.items[0].roles.currentItems[0]).toMatchObject({
      name: 'front-end',
      amount: 3,
    });
    expect(projectRepository.items[0].roles.currentItems[1]).toMatchObject({
      name: 'back-end',
      amount: 2,
    });
  });

  //TODO: validate if a custom error
  it('should be not able edit a project with non exists id', async () => {
    const project = makeFakeProject({
      authorId: '1',
    });

    await projectRepository.create(project);

    const result = await sut.execute({
      projectId: 'non-id',
      authorId: '1',
      title: 'title example',
      content: 'content example 2',
      roles: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  //TODO: validate if a custom error
  it('should be not able edit a project with invalid author id', async () => {
    const project = makeFakeProject();

    await projectRepository.create(project);

    const result = await sut.execute({
      projectId: project.id,
      authorId: 'non-id',
      title: 'title example',
      content: 'content example 2',
      roles: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
