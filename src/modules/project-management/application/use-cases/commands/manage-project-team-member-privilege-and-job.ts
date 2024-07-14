import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import {
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';
import { ManageProjectTeamMemberPrivilegeAndJobError } from './errors/manage-project-team-member-privilege-and-job-error';

interface ManageProjectTeamMemberPrivilegeAndJobRequest {
  ownerId: string;
  projectId: string;
  memberId: string;
  permissionType: PermissionType;
  jobsId: string[];
}

type ManageProjectTeamMemberPrivilegeAndJobResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | ManageProjectTeamMemberPrivilegeAndJobError.InvalidDeleteItSelf
  | Result<void>,
  Result<void>
>;

@Injectable()
export class ManageProjectTeamMemberPrivilegeAndJobUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    ownerId,
    permissionType,
    projectId,
    memberId,
    jobsId,
  }: ManageProjectTeamMemberPrivilegeAndJobRequest): Promise<ManageProjectTeamMemberPrivilegeAndJobResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const member = teamMembers.find(
        (member) =>
          member.recipientId === memberId &&
          member.status === MemberStatus.APPROVED,
      );

      if (!member) {
        return left(new ResourceNotFoundError());
      }

      const isOwner = teamMembers.find(
        (member) =>
          member.recipientId === ownerId &&
          member.permissionType === PermissionType.OWNER &&
          member.status === MemberStatus.APPROVED,
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
            new ManageProjectTeamMemberPrivilegeAndJobError.InvalidDeleteItSelf(),
          );
        }
      }

      member.permissionType = permissionType;

      const projectJobs = project.jobs.getItems();

      for (const job of projectJobs) {
        const isMemberAssigned = job.membersIdsAssigned
          .getItems()
          .find((id) => id === memberId);

        const isJobIdIncluded = jobsId.includes(job.id);

        if (isMemberAssigned && !isJobIdIncluded) {
          job.membersIdsAssigned.remove(memberId);

          continue;
        }

        if (!isMemberAssigned && isJobIdIncluded) {
          const assignedOrError = job.assignMember(memberId);

          if (assignedOrError?.isFailure) {
            throw left(assignedOrError);
          }
        }
      }

      await this.projectsRepository.save(project);

      return right(Result.ok());
    } catch (error) {
      return left(error);
    }
  }
}
