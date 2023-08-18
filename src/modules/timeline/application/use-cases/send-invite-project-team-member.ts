import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Member } from '@modules/timeline/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../repositories/projects-repository';

interface SendInviteProjectTeamMemberRequest {
  projectId: string;
  ownerId: string;
  recipientId: string;
}

type SendInviteProjectTeamMemberResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class SendInviteProjectTeamMemberUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    projectId,
    recipientId,
    ownerId,
  }: SendInviteProjectTeamMemberRequest): Promise<SendInviteProjectTeamMemberResponse> {
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

    const hasOwnerPermission = isMemberOfTeam.permissionType === 'owner';

    if (!hasOwnerPermission) {
      return left(new NotAllowedError());
    }

    const invitedMember = Member.create({
      recipientId,
      status: 'pending',
    });

    project.sendInviteTeamMember(invitedMember, ownerId);

    await this.projectsRepository.save(project);

    return right({});
  }
}
