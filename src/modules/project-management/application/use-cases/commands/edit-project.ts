import { Slug } from '@/common/domain/entities/value-objects/slug';
import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Role } from '@modules/project-management/domain/entities/role';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface EditProjectRequest {
  projectId: string;
  authorId: string;
  description: string;
  name: string;
  roles: Array<{
    id?: string;
    name: string;
    description: string;
    amount: number;
  }>;
}

type EditProjectResponse = Either<
  ResourceNotFoundError | NotFoundError | Result<void>,
  Result<void>
>;

@Injectable()
export class EditProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    authorId,
    description,
    roles,
    name,
  }: EditProjectRequest): Promise<EditProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      if (authorId !== project.authorId) {
        return left(new NotAllowedError());
      }

      const projectRolesList = project.roles;

      const createdRoles = roles.map((role) => {
        return Role.create(
          {
            projectId: project.id,
            membersAmount: role.amount,
            name: Slug.createFromText(role.name).getValue(),
            description: new Content(role.description),
          },
          role.id,
        ).getValue();
      });

      projectRolesList.update(createdRoles);

      project.description = new Content(description);
      project.name = name;
      project.roles = projectRolesList;

      await this.projectsRepository.save(project);

      return right(Result.ok<void>());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
