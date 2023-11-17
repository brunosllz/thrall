import { Slug } from '@/common/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@/modules/project-management/domain/entities/watched-lists/project-role-list';
import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeProject } from '@test/factories/make-project';
import { makeFakeRole } from '@test/factories/make-role';

import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
import { EditProjectUseCase } from './edit-project';

let sut: EditProjectUseCase;
let projectsRepository: InMemoryProjectsRepository;

describe('Edit a projects', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new EditProjectUseCase(projectsRepository);
  });

  it('should be able edit a project', async () => {
    let errorOccurred = false;

    try {
      const projects = makeFakeProject(
        {
          authorId: '1',
          roles: new ProjectRoleList([
            makeFakeRole(
              {
                projectId: '1',
                name: Slug.createFromText('devops').getValue(),
                membersAmount: 1,
              },
              '1',
            ),
          ]),
        },
        '1',
      );

      await projectsRepository.create(projects);

      await sut.execute({
        projectId: projects.id,
        authorId: '1',
        name: 'example title',
        description: 'example content',
        roles: [
          { id: '1', name: 'front-end', amount: 3, description: 'lorem' },
          { name: 'back-end', amount: 2, description: 'lorem' },
        ],
      });

      expect(projectsRepository.items[0]).toMatchObject({
        name: 'example title',
        description: {
          value: 'example content',
        },
      });
      expect(projectsRepository.items[0].roles.currentItems).toHaveLength(2);
      expect(projectsRepository.items[0].roles.currentItems[0]).toMatchObject({
        name: Slug.createFromText('front end').getValue(),
        membersAmount: 3,
      });
      expect(projectsRepository.items[0].roles.currentItems[1]).toMatchObject({
        name: Slug.createFromText('back end').getValue(),
        membersAmount: 2,
      });
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a projects with non exists id', async () => {
    let errorOccurred = false;

    try {
      const projects = makeFakeProject({
        authorId: '1',
      });

      await projectsRepository.create(projects);

      const result = await sut.execute({
        projectId: 'non-id',
        authorId: '1',
        name: 'title example',
        description: 'content example 2',
        roles: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });

  it('should be not able edit a projects with invalid author id', async () => {
    let errorOccurred = false;

    try {
      const projects = makeFakeProject();

      await projectsRepository.create(projects);

      const result = await sut.execute({
        projectId: projects.id,
        authorId: 'non-id',
        name: 'title example',
        description: 'content example 2',
        roles: [],
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(NotAllowedError);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).toBeFalsy();
  });
});
