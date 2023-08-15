import { makeFakeProject } from '@test/factories/make-project';
import { makeFakeRole } from '@test/factories/make-role';

import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository';
import { InMemoryRoleRepository } from '../repositories/in-memory/in-memory-role-repository';
import { DeleteProjectUseCase } from './delete-project';

let sut: DeleteProjectUseCase;
let projectRepository: InMemoryProjectRepository;
let roleRepository: InMemoryRoleRepository;

describe('Delete a project', () => {
  beforeEach(() => {
    roleRepository = new InMemoryRoleRepository();
    projectRepository = new InMemoryProjectRepository(roleRepository);
    sut = new DeleteProjectUseCase(projectRepository);
  });

  it('should be able delete a project', async () => {
    const project = makeFakeProject();

    await projectRepository.create(project);

    roleRepository.items.push(
      makeFakeRole({
        name: 'devops',
        projectId: project.id,
        amount: 1,
      }),
      makeFakeRole({
        name: 'front-end',
        projectId: project.id,
        amount: 4,
      }),
    );

    await sut.execute({ id: project.id });

    expect(projectRepository.items).toHaveLength(0);
    expect(roleRepository.items).toHaveLength(0);
  });
});
