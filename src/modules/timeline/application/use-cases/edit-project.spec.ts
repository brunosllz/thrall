import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';
import { makeFakeRole } from '@test/factories/make-role';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { EditProjectUseCase } from './edit-project';

let sut: EditProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Edit a projects', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    rolesRepository = new InMemoryRolesRepository();
    sut = new EditProjectUseCase(projectsRepository, rolesRepository);
  });

  it('should be able edit a projects', async () => {
    const projects = makeFakeProject({
      authorId: '1',
    });

    await projectsRepository.create(projects);

    rolesRepository.items.push(
      makeFakeRole(
        {
          name: 'devops',
          projectId: projects.id,
          amount: 1,
        },
        '1',
      ),
    );

    await sut.execute({
      projectId: projects.id,
      authorId: '1',
      title: 'example title',
      content: 'example content',
      roles: [
        { id: '1', name: 'front-end', amount: 3 },
        { name: 'back-end', amount: 2 },
      ],
    });

    expect(projectsRepository.items[0]).toMatchObject({
      title: 'example title',
      content: 'example content',
    });
    expect(projectsRepository.items[0].roles.currentItems).toHaveLength(2);
    expect(projectsRepository.items[0].roles.currentItems[0]).toMatchObject({
      name: 'front-end',
      amount: 3,
    });
    expect(projectsRepository.items[0].roles.currentItems[1]).toMatchObject({
      name: 'back-end',
      amount: 2,
    });
  });

  //TODO: validate if a custom error
  it('should be not able edit a projects with non exists id', async () => {
    const projects = makeFakeProject({
      authorId: '1',
    });

    await projectsRepository.create(projects);

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
  it('should be not able edit a projects with invalid author id', async () => {
    const projects = makeFakeProject();

    await projectsRepository.create(projects);

    const result = await sut.execute({
      projectId: projects.id,
      authorId: 'non-id',
      title: 'title example',
      content: 'content example 2',
      roles: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
