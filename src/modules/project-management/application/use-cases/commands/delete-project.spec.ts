import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { makeFakeJob } from '@test/factories/make-job';
import { makeFakeProject } from '@test/factories/make-project';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { DeleteProjectUseCase } from './delete-project';

let sut: DeleteProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;

describe('Delete a projects', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new DeleteProjectUseCase(projectsRepository);
  });

  it('should be able delete a projects', async () => {
    let errorOccurred = false;

    try {
      const projects = makeFakeProject(
        {
          authorId: '1',
          jobs: new ProjectJobList([
            makeFakeJob({
              projectId: '1',
              name: 'devops',
              jobAmountAvailable: 1,
            }),
            makeFakeJob({
              projectId: '1',
              name: 'front end',
              jobAmountAvailable: 4,
            }),
          ]),
        },
        '1',
      );

      await projectsRepository.create(projects);

      await sut.execute({ projectId: projects.id, authorId: '1' });

      expect(projectsRepository.items).toHaveLength(0);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be be not able delete a projects with non exist id', async () => {
    let errorOccurred = false;

    try {
      const result = await sut.execute({ projectId: 'non-id', authorId: '1' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able delete a projects with invalid author id', async () => {
    let errorOccurred = false;

    try {
      const projects = makeFakeProject(
        {
          authorId: '1',
          jobs: new ProjectJobList([
            makeFakeJob({
              projectId: '1',
              name: 'devops',
              jobAmountAvailable: 1,
            }),
            makeFakeJob({
              projectId: '1',
              name: 'front end',
              jobAmountAvailable: 4,
            }),
          ]),
        },
        '1',
      );

      await projectsRepository.create(projects);

      const result = await sut.execute({
        projectId: projects.id,
        authorId: 'non-id',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
