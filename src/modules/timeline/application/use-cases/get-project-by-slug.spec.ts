import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '../repositories/in-memory/in-memory-roles-repository';
import { GetProjectBySlugUseCase } from './get-project-by-slug';

let rolesRepository: InMemoryRolesRepository;
let projectsRepository: InMemoryProjectsRepository;
let sut: GetProjectBySlugUseCase;

describe('Get project by slug', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sut = new GetProjectBySlugUseCase(projectsRepository);
  });

  it('should be able to get a project by slug', async () => {
    const project = makeFakeProject({
      title: 'title example',
    });

    await projectsRepository.create(project);

    const result = await sut.execute({
      slug: 'title-example',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      project: expect.objectContaining({
        title: project.title,
      }),
    });
  });

  it('should be not able get a project with non exist slug', async () => {
    const result = await sut.execute({
      slug: 'non-exist-slug',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
