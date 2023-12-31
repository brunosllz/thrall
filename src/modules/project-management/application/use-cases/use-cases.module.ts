import { PrismaDatabaseModule } from '@modules/project-management/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { AddInterestedInProject } from './commands/add-interested-in-project';
import { CreateAnswerInProjectUseCase } from './commands/create-answer-in-project';
import { CreateProjectUseCase } from './commands/create-project';
import { DeleteProjectUseCase } from './commands/delete-project';
import { ManageInviteProjectTeamMemberUseCase } from './commands/manage-invite-project-team-member';
import { ManageProjectTeamMemberPrivilegeUseCase } from './commands/manage-project-team-member-privilege';
import { SendInviteProjectTeamMemberUseCase } from './commands/send-invite-project-team-member';
import { FetchGeneralSkillsFromProjectsUseCase } from './queries/fetch-general-skills-from-projects';
import { FetchProjectsByUserIdUseCase } from './queries/fetch-projects-by-user-id';
import { FetchProjectsWithShortDetailsUseCase } from './queries/fetch-projects-with-short-details';
import { GetProjectByIdUseCase } from './queries/get-project-by-id';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [
    CreateProjectUseCase,
    CreateAnswerInProjectUseCase,
    FetchProjectsByUserIdUseCase,
    DeleteProjectUseCase,
    SendInviteProjectTeamMemberUseCase,
    ManageInviteProjectTeamMemberUseCase,
    ManageProjectTeamMemberPrivilegeUseCase,
    AddInterestedInProject,
    FetchProjectsWithShortDetailsUseCase,
    GetProjectByIdUseCase,
    FetchGeneralSkillsFromProjectsUseCase,
  ],
  exports: [
    CreateProjectUseCase,
    CreateAnswerInProjectUseCase,
    FetchProjectsByUserIdUseCase,
    DeleteProjectUseCase,
    SendInviteProjectTeamMemberUseCase,
    ManageInviteProjectTeamMemberUseCase,
    ManageProjectTeamMemberPrivilegeUseCase,
    AddInterestedInProject,
    FetchProjectsWithShortDetailsUseCase,
    GetProjectByIdUseCase,
    FetchGeneralSkillsFromProjectsUseCase,
  ],
})
export class UseCasesModule {}
