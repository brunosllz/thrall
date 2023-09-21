import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { PermissionType } from '@modules/project-management/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { ManageProjectTeamMemberPrivilegeError } from './errors/manage-project-team-member-privilege-error';

interface ManageProjectTeamMemberPrivilegeRequest {
  ownerId: string;
  projectId: string;
  memberId: string;
  permissionType: PermissionType;
}

type ManageProjectTeamMemberPrivilegeResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | ManageProjectTeamMemberPrivilegeError.InvalidDeleteItSelf
  | Result<void>,
  Result<void>
>;

@Injectable()
export class ManageProjectTeamMemberPrivilegeUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    ownerId,
    permissionType,
    projectId,
    memberId,
  }: ManageProjectTeamMemberPrivilegeRequest): Promise<ManageProjectTeamMemberPrivilegeResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const isOwner = teamMembers.find(
        (member) =>
          member.recipientId === ownerId &&
          member.permissionType === PermissionType.OWNER,
      );

      if (!isOwner) {
        return left(new NotAllowedError());
      }

      const isItself = memberId === ownerId;

      if (isItself) {
        const isAbleToRemoveItself = teamMembers
          .filter((member) => member.recipientId !== ownerId)
          .some((member) => member.permissionType === PermissionType.OWNER);

        if (!isAbleToRemoveItself) {
          return left(
            new ManageProjectTeamMemberPrivilegeError.InvalidDeleteItSelf(),
          );
        }
      }

      const member = teamMembers.find(
        (member) => member.recipientId === memberId,
      );

      if (!member) {
        return left(new ResourceNotFoundError());
      }

      member.permissionType = permissionType;

      await this.projectsRepository.save(project);

      return right(Result.ok());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
