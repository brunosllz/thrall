import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';

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
    let errorOccurred = false;

    try {
      const projects = makeFakeProject();

      await projectsRepository.create(projects);

      rolesRepository.items.push(
        makeFakeRole({
          projectId: projects.id,
          name: Slug.createFromText('devops').getValue(),
          membersAmount: 1,
        }),
        makeFakeRole({
          projectId: projects.id,
          name: Slug.createFromText('front end').getValue(),
          membersAmount: 4,
        }),
      );

      await sut.execute({ id: projects.id });

      expect(projectsRepository.items).toHaveLength(0);
      expect(rolesRepository.items).toHaveLength(0);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be be not able delete a projects with non exist id', async () => {
    let errorOccurred = false;

    try {
      const result = await sut.execute({ id: 'non-id' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalsy();
  });
});
