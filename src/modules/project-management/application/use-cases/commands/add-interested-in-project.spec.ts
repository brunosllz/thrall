import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { faker } from '@faker-js/faker';

import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../../repositories/in-memory/in-memory-roles-repository';
import { AddInterestedInProject } from './add-interested-in-project';

let sut: AddInterestedInProject;
let projectsRepository: InMemoryProjectsRepository;
let rolesRepository: InMemoryRolesRepository;

describe('Add interested in project', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new AddInterestedInProject(projectsRepository);
  });

  it('should be able to express interest in project', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject();

      await projectsRepository.create(project);

      const userId = faker.string.uuid();

      const result = await sut.execute({
        projectId: project.id,
        userId: userId,
      });

      expect(result.isRight()).toBeTruthy();
      expect(projectsRepository.items).toHaveLength(1);
      expect(projectsRepository.items[0].interested.getItems()).toHaveLength(1);
      expect(projectsRepository.items[0].interested.getItems()).toEqual([
        expect.objectContaining({
          recipientId: userId,
        }),
      ]);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able to express interest with non exist project id', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject();

      await projectsRepository.create(project);

      const userId = faker.string.uuid();

      const result = await sut.execute({
        projectId: 'non-id',
        userId: userId,
      });

      expect(result.isLeft).toBeTruthy();
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
