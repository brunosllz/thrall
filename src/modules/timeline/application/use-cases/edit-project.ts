import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { ProjectRoleList } from '@modules/timeline/domain/entities/project-role-list';
import { Role } from '@modules/timeline/domain/entities/role';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

import { ProjectRepository } from '../repositories/project-repository';
import { RoleRepository } from '../repositories/role-repository';

interface EditProjectRequest {
  projectId: string;
  authorId: string;
  content: string;
  title: string;
  roles: Array<{
    id?: string;
    name: string;
    amount: number;
  }>;
}

type EditProjectResponse = Either<
  ResourceNotFoundError | NotFoundError,
  Record<string, never>
>;

@Injectable()
export class EditProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute({
    projectId,
    authorId,
    content,
    roles,
    title,
  }: EditProjectRequest): Promise<EditProjectResponse> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== project.authorId) {
      return left(new NotAllowedError());
    }

    const currentRoles = await this.roleRepository.findManyByProjectId(
      project.id,
    );

    const projectRolesList = new ProjectRoleList(currentRoles);

    const createdRoles = roles.map((role) => {
      return Role.create(
        {
          amount: role.amount,
          name: role.name,
          projectId: project.id,
        },
        role.id,
      );
    });

    projectRolesList.update(createdRoles);

    project.content = content;
    project.title = title;
    project.roles = projectRolesList;

    await this.projectRepository.save(project);

    return right({});
  }
}
