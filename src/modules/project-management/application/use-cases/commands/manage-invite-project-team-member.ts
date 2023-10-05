import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Result } from '@common/logic/result';
import { MemberStatus } from '@modules/project-management/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface ManageInviteProjectTeamMemberRequest {
  memberId: string;
  projectId: string;
  status: 'approved' | 'rejected';
}

type ManageInviteProjectTeamMemberResponse = Either<
  ResourceNotFoundError | NotAllowedError | Result<any>,
  Result<void>
>;

@Injectable()
export class ManageInviteProjectTeamMemberUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    memberId,
    projectId,
    status,
  }: ManageInviteProjectTeamMemberRequest): Promise<ManageInviteProjectTeamMemberResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const MemberHasInvite = teamMembers.find(
        (member) =>
          member.recipientId === memberId &&
          member.status === MemberStatus.PENDING,
      );

      if (!MemberHasInvite) {
        return left(new NotAllowedError());
      }

      const haveAPendingInvite =
        MemberHasInvite.status === MemberStatus.PENDING;

      if (!haveAPendingInvite) {
        return left(new NotAllowedError());
      }

      if (status === MemberStatus.APPROVED) {
        project.acceptInviteTeamMember(memberId);
      } else {
        project.rejectInviteTeamMember(memberId);
      }

      await this.projectsRepository.save(project);

      return right(Result.ok<void>());
    } catch (error) {
      return left(Result.fail<void>(error));
    }
  }
}
