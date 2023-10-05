import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface RemoveRejectedInviteTeamMemberRequest {
  projectId: string;
  recipientId: string;
}

type RemoveRejectedInviteTeamMemberResponse = Either<
  ResourceNotFoundError | Result<any>,
  Result<void>
>;

@Injectable()
export class RemoveRejectedInviteTeamMemberUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    recipientId,
  }: RemoveRejectedInviteTeamMemberRequest): Promise<RemoveRejectedInviteTeamMemberResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const currentTeamMembers = teamMembers.filter(
        (member) => member.recipientId !== recipientId,
      );

      project.teamMembers.update(currentTeamMembers);

      await this.projectsRepository.save(project);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
