import { Either, right } from '@common/logic/either';
import { ProjectRoleList } from '@modules/timeline/domain/entities/project-role-list';
import { Role } from '@modules/timeline/domain/entities/role';
import { Injectable } from '@nestjs/common';

import { Project } from '../../domain/entities/project';
import { ProjectRepository } from '../repositories/project-repository';

interface CreateProjectRequest {
  authorId: string;
  content: string;
  title: string;
  roles: Array<{
    name: string;
    amount: number;
  }>;
}

type CreateProjectResponse = Either<
  Record<string, never>,
  Record<string, never>
>;

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({
    content,
    title,
    roles,
    authorId,
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
    const project = Project.create({ authorId, content, title });

    const createdRoles = roles.map((role) => {
      return Role.create({
        projectId: project.id,
        amount: role.amount,
        name: role.name,
      });
    });

    project.roles = new ProjectRoleList(createdRoles);

    await this.projectRepository.create(project);

    return right({});
  }
}
