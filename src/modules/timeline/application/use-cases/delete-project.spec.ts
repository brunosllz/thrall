import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';
import { makeFakeRole } from '@test/factories/make-role';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { DeleteProjectUseCase } from './delete-project';

let sut: DeleteProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Delete a projects', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new DeleteProjectUseCase(projectsRepository);
  });

  it('should be able delete a projects', async () => {
    const projects = makeFakeProject();

    await projectsRepository.create(projects);

    rolesRepository.items.push(
      makeFakeRole({
        name: 'devops',
        projectId: projects.id,
        amount: 1,
      }),
      makeFakeRole({
        name: 'front-end',
        projectId: projects.id,
        amount: 4,
      }),
    );

    await sut.execute({ id: projects.id });

    expect(projectsRepository.items).toHaveLength(0);
    expect(rolesRepository.items).toHaveLength(0);
  });

  it('should be be not able delete a projects with non exist id', async () => {
    const result = await sut.execute({ id: 'non-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
