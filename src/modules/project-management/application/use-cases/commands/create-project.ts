import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Project } from '@modules/project-management/domain/entities/project';
import { Role } from '@modules/project-management/domain/entities/role';
import { Technology } from '@modules/project-management/domain/entities/technology';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { Meeting } from '@modules/project-management/domain/entities/value-objects/meeting';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@modules/project-management/domain/entities/watched-lists/project-role-list';
import { ProjectTechnologyList } from '@modules/project-management/domain/entities/watched-lists/project-technology-list';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { ProjectDTO } from './dtos/project-dto';

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
    name,
    roles,
    imageUrl,
    status,
    technologies,
    description,
    requirements,
    ...request
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      const projectAlreadyExists = await this.projectsRepository.exists({
        authorId: authorId,
        slug: Slug.createFromText(name).getValue(),
      });

      if (projectAlreadyExists) {
        return left(new AlreadyExistsError(`name "${name}"`));
      }

      const meetingOrError = Meeting.create(request.meeting);

      if (meetingOrError.isFailure) {
        return left(Result.fail(meetingOrError.error));
      }

      const meeting = meetingOrError.getValue();

      const projectOrError = Project.create({
        authorId,
        description: new Content(description),
        name,
        imageUrl,
        status,
        meeting,
        requirements: new Content(requirements),
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
