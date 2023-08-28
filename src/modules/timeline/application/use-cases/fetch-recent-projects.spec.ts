import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { FetchRecentProjectsUseCase } from './fetch-recent-projects';

let rolesRepository: InMemoryRolesRepository;
let projectsRepository: InMemoryProjectsRepository;
let sut: FetchRecentProjectsUseCase;

describe('Fetch recent projects', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new FetchRecentProjectsUseCase(projectsRepository);
  });

  it('should be able to fetch recent projects', async () => {
    let errorOccurred = false;
    try {
      await projectsRepository.create(
        makeFakeProject({
          createdAt: new Date(2023, 8, 16),
        }),
      );

      await projectsRepository.create(
        makeFakeProject({
          createdAt: new Date(2023, 8, 15),
        }),
      );

      await projectsRepository.create(
        makeFakeProject({
          createdAt: new Date(2023, 8, 14),
        }),
      );

      const result = await sut.execute({
        pageIndex: 1,
        pageSize: 5,
      });

      const projects = result.value.getValue();

      expect(projects).toEqual([
        expect.objectContaining({ createdAt: new Date(2023, 8, 16) }),
        expect.objectContaining({ createdAt: new Date(2023, 8, 15) }),
        expect.objectContaining({ createdAt: new Date(2023, 8, 14) }),
      ]);
      expect(result.isRight()).toBe(true);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be able to fetch paginated answer comments', async () => {
    let errorOccurred = false;

    try {
      for (let i = 1; i <= 10; i++) {
        await projectsRepository.create(makeFakeProject());
      }

      const result = await sut.execute({
        pageIndex: 2,
        pageSize: 8,
      });

      const projects = result.value.getValue();

      expect(projects).toHaveLength(2);
      expect(result.isRight()).toBe(true);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
