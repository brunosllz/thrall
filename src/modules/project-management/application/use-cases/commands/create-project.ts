import { Slug } from '@/core/domain/value-objects/slug';
import { AlreadyExistsError } from '@/core/errors/errors/already-exists-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Job } from '@/modules/project-management/domain/entities/job';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { AvailableToParticipate } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import { Project } from '@modules/project-management/domain/entities/project';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { CreateProjectDTO } from './dtos/create-project-dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    authorId,
    name,
    jobs,
    imageUrl,
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
        return left(
          Result.fail<AvailableToParticipate>(
            availableToParticipateOrError.error,
          ),
        );
      }

      const availableToParticipate = availableToParticipateOrError.getValue();

      const projectOrError = Project.create({
        authorId,
        description: new Content(description),
        name,
        imageUrl,
        bannerUrl,
        availableToParticipate,
      });

      if (projectOrError.isFailure) {
        return left(Result.fail(projectOrError.error));
      }

      const project = projectOrError.getValue();

      const createdJobs = jobs.map((job) => {
        const jobOrError = Job.create({
          jobAmountAvailable: job.jobAmountAvailable,
          projectId: project.id,
          name: job.name,
          description: new Content(job.description),
        });

        if (jobOrError.isFailure) {
          throw jobOrError.errorValue();
        }

        const createdJob = jobOrError.getValue();

        return createdJob;
      });

      const createdGeneralSkills = generalSkills.map((generalSkills) => {
        const skillsOrError = Skill.create(generalSkills.slug);

        if (skillsOrError.isFailure) {
          throw skillsOrError.errorValue();
        }

        const createdGeneralSkill = skillsOrError.getValue();

        return createdGeneralSkill;
      });

      project.jobs = new ProjectJobList(createdJobs);
      project.generalSkills = new ProjectGeneralSkillList(createdGeneralSkills);

      await this.projectsRepository.create(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}

type CreateProjectRequest = CreateProjectDTO;

type CreateProjectResponse = Either<
  AlreadyExistsError | Result<void> | Result<any> | any,
  Result<void>
>;
