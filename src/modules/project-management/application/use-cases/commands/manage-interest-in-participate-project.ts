import { InterestedStatus } from '@/modules/project-management/domain/entities/interested';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Result } from '@/core/logic/result';
import {
  Member,
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';
import { Injectable } from '@nestjs/common';

import { ProjectsRepository } from '../../repositories/projects-repository';

interface ManageInterestInParticipateProjectRequest {
  ownerId: string;
  userId: string;
  projectId: string;
  status: 'approved' | 'rejected';
}

type ManageInterestInParticipateProjectResponse = Either<
  ResourceNotFoundError | NotAllowedError | Result<void>,
  Result<void>
>;

@Injectable()
export class ManageInterestInParticipateProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    ownerId,
    userId,
    projectId,
    status,
  }: ManageInterestInParticipateProjectRequest): Promise<ManageInterestInParticipateProjectResponse> {
    try {
      const project = await this.projectsRepository.findById(projectId);

      if (!project) {
        return left(new ResourceNotFoundError());
      }

      const interestedUsers = project.interested.getItems();

      const interestedUser = interestedUsers.find(
        (user) =>
          user.recipientId === userId &&
          user.status === InterestedStatus.PENDING,
      );

      if (!interestedUser) {
        return left(new ResourceNotFoundError());
      }

      const teamMembers = project.teamMembers.getItems();

      const isOwner = teamMembers.find(
        (member) =>
          member.recipientId === ownerId &&
          member.status === MemberStatus.APPROVED &&
          member.permissionType === PermissionType.OWNER,
      );

      if (!isOwner) {
        return left(new NotAllowedError());
      }

      if (status === InterestedStatus.APPROVED) {
        interestedUser.status = InterestedStatus.APPROVED;

        project.teamMembers.add(
          Member.create({
            recipientId: interestedUser.recipientId,
            permissionType: PermissionType.MEMBER,
            status: MemberStatus.APPROVED,
          }).getValue(),
        );
      } else {
        interestedUser.status = InterestedStatus.REJECTED;
      }

      await this.projectsRepository.save(project);

      return right(Result.ok<void>());
    } catch (error) {
      return left(error);
    }
  }
}
