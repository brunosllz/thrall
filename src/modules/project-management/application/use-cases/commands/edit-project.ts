import { Slug } from '@/core/domain/value-objects/slug';
import { AlreadyExistsError } from '@/core/errors/errors/already-exists-error';
import { Replace } from '@/core/logic/types/Replace';
import { Skill } from '@/modules/account/domain/skill';
import { Job } from '@/modules/project-management/domain/entities/job';
import { AvailableToParticipate } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { CreateProjectDTO } from './dtos/create-project-dto';

type EditProjectRequest = Partial<
  Replace<
    Omit<CreateProjectDTO, 'authorId'>,
    {
      jobs: Array<{
        id?: string;
        name: string;
        jobAmountAvailable: number;
        description: string;
      }>;
    }
  >
> & {
  projectId: string;
  recipientId: string;
};

type EditProjectResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | AlreadyExistsError
  | Result<void>
  | Result<any>,
  Result<void>
>;

@Injectable()
export class EditProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    recipientId,
    projectId,
    availableToParticipate,
    bannerUrl,
    description,
    generalSkills,
    imageUrl,
    name,
    jobs,
  }: EditProjectRequest): Promise<EditProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const hasPermissionToEditProject = project.teamMembers
        .getItems()
        .some(
          (member) =>
            member.recipientId === recipientId &&
            member.permissionType === 'owner',
        );

      if (!hasPermissionToEditProject) {
        return left(new NotAllowedError());
      }

      const projectJobsList = project.jobs;
      const hasJobsToEdit = jobs && jobs.length > 0;

      if (hasJobsToEdit) {
        const createdJobs = jobs.map((job) => {
          return Job.create(
            {
              projectId: project.id,
              jobAmountAvailable: job.jobAmountAvailable,
              name: job.name,
              description: new Content(job.description),
            },
            job.id,
          ).getValue();
        });

        projectJobsList.update(createdJobs);
      }

      const projectGeneralSkillsList = project.generalSkills;
      const hasGeneralSkillsToEdit = generalSkills && generalSkills.length > 0;

      if (hasGeneralSkillsToEdit) {
        const createdGeneralSkills = generalSkills.map((skill) => {
          return Skill.create(skill.slug).getValue();
        });

        projectGeneralSkillsList.update(createdGeneralSkills);
      }

      const hasProjectAvailableToParticipateToEdit = availableToParticipate;

      if (hasProjectAvailableToParticipateToEdit) {
        const availableToParticipateOrError = AvailableToParticipate.create({
          value: {
            availableDays: availableToParticipate.availableDays,
            availableTime: {
              unit: availableToParticipate.availableTime.unit,
              value: availableToParticipate.availableTime.value,
            },
          },
        });

        if (availableToParticipateOrError.isFailure) {
          return left(Result.fail(availableToParticipateOrError.error));
        }

        const editedAvailableToParticipate =
          availableToParticipateOrError.getValue();

        project.availableToParticipate = editedAvailableToParticipate;
      }

      const hasProjectDescriptionToEdit = description;

      if (hasProjectDescriptionToEdit) {
        project.description = new Content(description);
      }

      const hasProjectNameToEdit = name && name !== project.name;

      if (hasProjectNameToEdit) {
        const alreadyExistsProjectWithTheSameName =
          await this.projectsRepository.exists({
            authorId: recipientId,
            slug: Slug.createFromText(name).getValue(),
          });

        if (alreadyExistsProjectWithTheSameName) {
          return left(new AlreadyExistsError(name));
        }

        project.name = name;
      }
      const hasProjectBannerUrlToEdit = bannerUrl;

      if (hasProjectBannerUrlToEdit) {
        project.bannerUrl = bannerUrl;
      }

      const hasProjectImageUrlToEdit = imageUrl;

      if (hasProjectImageUrlToEdit) {
        project.imageUrl = imageUrl;
      }

      await this.projectsRepository.save(project);

      return right(Result.ok<void>());
    } catch (error) {
      return left(error);
    }
  }
}
