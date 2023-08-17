import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../repositories/projects-repository';

interface ManageInviteProjectTeamMemberRequest {
  memberId: string;
  projectId: string;
  status: 'accepted' | 'rejected';
}

type ManageInviteProjectTeamMemberResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class ManageInviteProjectTeamMemberUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    memberId,
    projectId,
    status,
  }: ManageInviteProjectTeamMemberRequest): Promise<ManageInviteProjectTeamMemberResponse> {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    const teamMembers = project.teamMembers.getItems();

    const MemberHasInvite = teamMembers.find(
      (member) => member.recipientId === memberId,
    );

    if (!MemberHasInvite) {
      return left(new NotAllowedError());
    }

    const haveAPendingInvite = MemberHasInvite.status === 'pending';

    if (!haveAPendingInvite) {
      return left(new NotAllowedError());
    }

    if (status === 'accepted') {
      MemberHasInvite.status = 'approved';
    } else {
      MemberHasInvite.status = status;
    }

    await this.projectsRepository.save(project);

    return right({});
  }
}
