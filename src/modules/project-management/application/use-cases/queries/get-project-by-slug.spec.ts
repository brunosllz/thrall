import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsDAO } from '../../dao/in-memory/in-memory-projects-dao';
import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { GetProjectBySlugUseCase } from './get-project-by-slug';

let projectsDAO: InMemoryProjectsDAO;
let projectsRepository: InMemoryProjectsRepository;
let sut: GetProjectBySlugUseCase;

describe('Get project by slug', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    projectsDAO = new InMemoryProjectsDAO(projectsRepository);
    sut = new GetProjectBySlugUseCase(projectsDAO);
  });

  it('should be able to get a project by slug', async () => {
    let errorOccurred = false;

    try {
      const project = makeFakeProject({
        authorId: '1',
        name: 'title example',
      });

      await projectsRepository.create(project);

      const result = await sut.execute({
        slug: 'title-example',
        authorId: '1',
      });

      expect(result.isRight()).toBe(true);
      expect(result.value).toMatchObject({
        _value: expect.objectContaining({
          name: project.name,
        }),
      });
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able get a project with non exist slug', async () => {
    let errorOccurred = false;
    try {
      const result = await sut.execute({
        slug: 'non-exist-slug',
        authorId: '1',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
