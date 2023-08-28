import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Role } from '@modules/timeline/domain/entities/role';
import { Technology } from '@modules/timeline/domain/entities/technology';
import {
  Requirement,
  PeriodIdentifier,
} from '@modules/timeline/domain/entities/value-objects/requirement';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@modules/timeline/domain/entities/watched-lists/project-role-list';
import { ProjectTechnologyList } from '@modules/timeline/domain/entities/watched-lists/project-technology-list';
import { Injectable } from '@nestjs/common';

import { Project } from '../../domain/entities/project';
import { ProjectsRepository } from '../repositories/projects-repository';

interface RequirementDTO {
  periodAmount: number;
  periodIdentifier: PeriodIdentifier;
  content: string;
}

interface TechnologyDTO {
  slug: string;
}

interface RoleDTO {
  name: string;
  membersAmount: number;
}

interface ProjectDTO {
  authorId: string;
  content: string;
  title: string;
  roles: Array<RoleDTO>;
  technologies: Array<TechnologyDTO>;
  requirement: RequirementDTO;
}

type CreateProjectRequest = ProjectDTO;

type CreateProjectResponse = Either<
  AlreadyExistsError | Result<any>,
  Result<void>
>;

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    authorId,
    content,
    roles,
    technologies,
    title,
    ...request
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      const projectAlreadyExists = await this.projectsRepository.exists({
        authorId: authorId,
        slug: Slug.createFromText(title).getValue(),
      });

      if (projectAlreadyExists) {
        return left(new AlreadyExistsError('title'));
      }

      const requirementOrError = Requirement.create(request.requirement);

      if (requirementOrError.isFailure) {
        return left(Result.fail(requirementOrError.error));
      }

      const requirement = requirementOrError.getValue();

      const projectOrError = Project.create({
        authorId,
        content,
        title,
        requirement,
      });

      if (projectOrError.isFailure) {
        return left(Result.fail(projectOrError.error));
      }

      const project = projectOrError.getValue();

      const createdRoles = roles.map((role) => {
        const roleOrError = Role.create({
          membersAmount: role.membersAmount,
          projectId: project.id,
          name: Slug.createFromText(role.name).getValue(),
        });

        if (roleOrError.isFailure) {
          throw roleOrError.errorValue();
        }

        const createdRole = roleOrError.getValue();

        return createdRole;
      });

      const createdTechnologies = technologies.map((technology) => {
        const technologyOrError = Technology.create(technology.slug);

        if (technologyOrError.isFailure) {
          throw technologyOrError.errorValue();
        }

        const createdTechnology = technologyOrError.getValue();

        return createdTechnology;
      });

      project.roles = new ProjectRoleList(createdRoles);
      project.technologies = new ProjectTechnologyList(createdTechnologies);

      await this.projectsRepository.create(project);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<any>(error));
    }
  }
}
