import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { AvailableToParticipate } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Project } from '@modules/project-management/domain/entities/project';
import { Role } from '@modules/project-management/domain/entities/role';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { ProjectRoleList } from '@modules/project-management/domain/entities/watched-lists/project-role-list';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { ProjectDTO } from './dtos/project-dto';

type CreateProjectRequest = ProjectDTO;

type CreateProjectResponse = Either<
  AlreadyExistsError | Result<void> | Result<any>,
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
    generalSkills,
    description,
    availableToParticipate: { availableDays, availableTime },
    bannerUrl,
  }: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      const projectAlreadyExists = await this.projectsRepository.exists({
        authorId: authorId,
        slug: Slug.createFromText(name).getValue(),
      });

      if (projectAlreadyExists) {
        return left(new AlreadyExistsError(`name "${name}"`));
      }

      const availableToParticipateOrError = AvailableToParticipate.create({
        value: {
          availableDays,
          availableTime: {
            unit: availableTime.unit,
            value: availableTime.value,
          },
        },
      });

      if (availableToParticipateOrError.isFailure) {
        return left(Result.fail(availableToParticipateOrError.error));
      }

      const availableToParticipate = availableToParticipateOrError.getValue();

      const projectOrError = Project.create({
        authorId,
        description: new Content(description),
        name,
        imageUrl,
        bannerUrl,
        status,
        availableToParticipate,
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
          description: new Content(role.description),
        });

        if (roleOrError.isFailure) {
          throw roleOrError.errorValue();
        }

        const createdRole = roleOrError.getValue();

        return createdRole;
      });

      const createdGeneralSkills = generalSkills.map((generalSkills) => {
        const skillsOrError = Skill.create(generalSkills.slug);

        if (skillsOrError.isFailure) {
          throw skillsOrError.errorValue();
        }

        const createdGeneralSkill = skillsOrError.getValue();

        return createdGeneralSkill;
      });

      project.roles = new ProjectRoleList(createdRoles);
      project.generalSkills = new ProjectGeneralSkillList(createdGeneralSkills);

      await this.projectsRepository.create(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}
