import { InMemoryProjectsRepository } from '@modules/project-management/application/repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '@modules/project-management/application/repositories/in-memory/in-memory-roles-repository';
import { SpyInstance } from 'vitest';

import { makeFakeMember } from '@test/factories/make-member';
import { makeFakeProject } from '@test/factories/make-project';
import { waitFor } from '@test/factories/utils/wait-for';

import { MemberStatus } from '../../domain/entities/member';
import { ManageInviteProjectTeamMemberUseCase } from '../use-cases/commands/manage-invite-project-team-member';
import { RemoveRejectedInviteTeamMemberUseCase } from '../use-cases/commands/remove-rejected-invite-team-member';
import { OnRejectedInviteTeamMember } from './on-rejected-invite-team-member';

let projectsRepository: InMemoryProjectsRepository;

let rolesRepository: InMemoryRolesRepository;
let removeRejectedInviteTeamMemberUseCase: RemoveRejectedInviteTeamMemberUseCase;
let manageInviteProjectTeamMemberUseCase: ManageInviteProjectTeamMemberUseCase;

let removeRejectedInviteTeamMemberExecuteSpy: SpyInstance;

describe('On rejected invite team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);

    removeRejectedInviteTeamMemberUseCase =
      new RemoveRejectedInviteTeamMemberUseCase(projectsRepository);
    manageInviteProjectTeamMemberUseCase =
      new ManageInviteProjectTeamMemberUseCase(projectsRepository);

    removeRejectedInviteTeamMemberExecuteSpy = vi.spyOn(
      removeRejectedInviteTeamMemberUseCase,
      'execute',
    );

    new OnRejectedInviteTeamMember(removeRejectedInviteTeamMemberUseCase);
  });

  it('should send a notification when send a invite to team member', async () => {
    const member = makeFakeMember({
      status: MemberStatus.PENDING,
    });

    const project = makeFakeProject({
      authorId: '1',
    });

    project.teamMembers.add(member);

    await projectsRepository.create(project);

    await manageInviteProjectTeamMemberUseCase.execute({
      memberId: member.recipientId,
      projectId: project.id,
      status: 'rejected',
    });

    await waitFor(() => {
      expect(removeRejectedInviteTeamMemberExecuteSpy).toHaveBeenCalled();
    });
  });
});
