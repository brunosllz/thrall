import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { PermissionType } from '@modules/project-management/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface SendInviteProjectTeamMemberRequest {
  projectId: string;
  ownerId: string;
  recipientId: string;
}

type SendInviteProjectTeamMemberResponse = Either<
  ResourceNotFoundError | NotAllowedError | Result<any> | Result<void>,
  Result<void>
>;

@Injectable()
export class SendInviteProjectTeamMemberUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    recipientId,
    ownerId,
  }: SendInviteProjectTeamMemberRequest): Promise<SendInviteProjectTeamMemberResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const isMemberOfTeam = teamMembers.find(
        (member) => member.recipientId === ownerId,
      );

      if (!isMemberOfTeam) {
        return left(new NotAllowedError());
      }

      const hasOwnerPermission =
        isMemberOfTeam.permissionType === PermissionType.OWNER;

      if (!hasOwnerPermission) {
        return left(new NotAllowedError());
      }

      const sendInviteOrError = project.sendInviteTeamMember(
        recipientId,
        ownerId,
      );

      if (sendInviteOrError?.isFailure) {
        return left(Result.fail(sendInviteOrError.error));
      }

      await this.projectsRepository.save(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}
