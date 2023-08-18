import { Either, right } from '@common/logic/either';
import { ProjectRoleList } from '@modules/timeline/domain/entities/project-role-list';
import { ProjectTechnologyList } from '@modules/timeline/domain/entities/project-technology-list';
import { Role } from '@modules/timeline/domain/entities/role';
import { Technology } from '@modules/timeline/domain/entities/technology';
import { Requirement } from '@modules/timeline/domain/entities/value-objects/requirement';
import { Injectable } from '@nestjs/common';

import { Project } from '../../domain/entities/project';
import { ProjectsRepository } from '../repositories/projects-repository';

interface CreateProjectRequest {
  authorId: string;
  content: string;
  title: string;
  roles: Array<{
    name: string;
    amount: number;
  }>;
  technologies: Array<{ slug: string }>;
  requirements: {
    timeAmount: number;
    timeIdentifier: 'day' | 'week' | 'month';
    content: string;
  };
}

type CreateProjectResponse = Either<null, Record<string, never>>;

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    content,
    title,
    roles,
    authorId,
    requirements,
    technologies,
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
    const project = Project.create({
      authorId,
      content,
      title,
      requirements: Requirement.create(requirements),
    });

    const createdRoles = roles.map((role) => {
      return Role.create({
        projectId: project.id,
        amount: role.amount,
        name: role.name,
      });
    });

    const createdTechnologies = technologies.map((technology) => {
      return Technology.create(technology.slug);
    });

    project.roles = new ProjectRoleList(createdRoles);
    project.technologies = new ProjectTechnologyList(createdTechnologies);

    await this.projectsRepository.create(project);

    return right({});
  }
}
