import { PrismaDatabaseModule } from '@modules/project-management/infra/prisma/prisma-database.module';
import { Module } from '@nestjs/common';

import { AddInterestedInProject } from './commands/add-interested-in-project';
import { CreateProjectUseCase } from './commands/create-project';
import { DeleteProjectUseCase } from './commands/delete-project';
import { EditProjectUseCase } from './commands/edit-project';
import { ManageInviteProjectTeamMemberUseCase } from './commands/manage-invite-project-team-member';
import { ManageProjectTeamMemberPrivilegeAndJobUseCase } from './commands/manage-project-team-member-privilege-and-job';
import { SendInviteProjectTeamMemberUseCase } from './commands/send-invite-project-team-member';
import { FetchGeneralSkillsFromProjectsUseCase } from './queries/fetch-general-skills-from-projects';
import { FetchProjectsByUserIdUseCase } from './queries/fetch-projects-by-user-id';
import { FetchProjectsInvolvedByUserIdUseCase } from './queries/fetch-projects-involved-by-user-id';
import { FetchProjectsWithShortDetailsUseCase } from './queries/fetch-projects-with-short-details';
import { GetProjectByIdUseCase } from './queries/get-project-by-id';
import { GetProjectBySlugUseCase } from './queries/get-project-by-slug';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [
    CreateProjectUseCase,
    FetchProjectsByUserIdUseCase,
    DeleteProjectUseCase,
    SendInviteProjectTeamMemberUseCase,
    ManageInviteProjectTeamMemberUseCase,
    ManageProjectTeamMemberPrivilegeAndJobUseCase,
    AddInterestedInProject,
    FetchProjectsWithShortDetailsUseCase,
    GetProjectByIdUseCase,
    FetchGeneralSkillsFromProjectsUseCase,
    GetProjectBySlugUseCase,
    EditProjectUseCase,
    FetchProjectsInvolvedByUserIdUseCase,
  ],
  exports: [
    CreateProjectUseCase,
    FetchProjectsByUserIdUseCase,
    DeleteProjectUseCase,
    SendInviteProjectTeamMemberUseCase,
    ManageInviteProjectTeamMemberUseCase,
    ManageProjectTeamMemberPrivilegeAndJobUseCase,
    AddInterestedInProject,
    FetchProjectsWithShortDetailsUseCase,
    GetProjectByIdUseCase,
    FetchGeneralSkillsFromProjectsUseCase,
    GetProjectBySlugUseCase,
    EditProjectUseCase,
    FetchProjectsInvolvedByUserIdUseCase,
  ],
})
export class UseCasesModule {}
