import { NotAllowedError } from '@common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../repositories/projects-repository';

interface ManageProjectTeamMemberPrivilegeRequest {
  ownerId: string;
  projectId: string;
  memberId: string;
  permissionType: 'owner' | 'member';
}

type ManageProjectTeamMemberPrivilegeResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
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
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return left(new ResourceNotFoundError());
    }

    const teamMembers = project.teamMembers.getItems();

    const isOwner = teamMembers.find(
      (member) =>
        member.recipientId === ownerId && member.permissionType === 'owner',
    );

    if (!isOwner) {
      return left(new NotAllowedError());
    }

    const isItself = memberId === ownerId;

    if (isItself) {
      const isAbleToRemoveItself = teamMembers
        .filter((member) => member.recipientId !== ownerId)
        .some((member) => member.permissionType === 'owner');

      if (!isAbleToRemoveItself) {
        return left(new NotAllowedError());
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

    return right({});
  }
}
