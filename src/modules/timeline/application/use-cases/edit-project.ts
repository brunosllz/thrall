import { ProjectRoleList } from '@modules/timeline/domain/entities/project-role-list';
import { Role } from '@modules/timeline/domain/entities/role';
import { Injectable } from '@nestjs/common';

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

type EditProjectResponse = Promise<void>;

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
  }: EditProjectRequest): EditProjectResponse {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new Error('resources not found.');
    }

    if (authorId !== project.authorId) {
      throw new Error('not allowed.');
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
  }
}
