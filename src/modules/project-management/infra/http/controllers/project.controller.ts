import { AlreadyExistsError } from '@/core/errors/errors/already-exists-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AuthUser } from '@/core/infra/http/auth/auth-user';
import { CurrentUser } from '@/core/infra/http/auth/decorators/current-user';
import { ZodValidationPipe } from '@/core/infra/pipes/zod-validation-pipe';
import { Result } from '@/core/logic/result';
import { AddInterestedInProject } from '@/modules/project-management/application/use-cases/commands/add-interested-in-project';
import { DeleteProjectUseCase } from '@/modules/project-management/application/use-cases/commands/delete-project';
import { EditProjectUseCase } from '@/modules/project-management/application/use-cases/commands/edit-project';
import { ManageProjectTeamMemberPrivilegeAndJobError } from '@/modules/project-management/application/use-cases/commands/errors/manage-project-team-member-privilege-and-job-error';
import { ManageInviteProjectTeamMemberUseCase } from '@/modules/project-management/application/use-cases/commands/manage-invite-project-team-member';
import { ManageProjectTeamMemberPrivilegeAndJobUseCase } from '@/modules/project-management/application/use-cases/commands/manage-project-team-member-privilege-and-job';
import { SendInviteProjectTeamMemberUseCase } from '@/modules/project-management/application/use-cases/commands/send-invite-project-team-member';
import { FetchGeneralSkillsFromProjectsUseCase } from '@/modules/project-management/application/use-cases/queries/fetch-general-skills-from-projects';
import { FetchProjectsInvolvedByUserIdUseCase } from '@/modules/project-management/application/use-cases/queries/fetch-projects-involved-by-user-id';
import { FetchProjectsWithShortDetailsUseCase } from '@/modules/project-management/application/use-cases/queries/fetch-projects-with-short-details';
import { GetProjectByIdUseCase } from '@/modules/project-management/application/use-cases/queries/get-project-by-id';
import { GetProjectBySlugUseCase } from '@/modules/project-management/application/use-cases/queries/get-project-by-slug';
import { CreateProjectUseCase } from '@modules/project-management/application/use-cases/commands/create-project';
import { FetchProjectsByUserIdUseCase } from '@modules/project-management/application/use-cases/queries/fetch-projects-by-user-id';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';

import {
  AddInterestInProjectParamsSchema,
  addInterestInProjectParamsSchema,
} from '../validation-schemas/add-interest-in-project-schema';
import {
  CreateProjectBodySchema,
  createProjectBodySchema,
} from '../validation-schemas/create-project-schema';
import {
  FetchProjectsWithShortDetailsQuerySchema,
  fetchProjectsWithShortDetailsQuerySchema,
} from '../validation-schemas/fetch-projects-with-short-details-schema';
import {
  GetAllGeneralSkillsLinkedToTheProjectsQuerySchema,
  getAllGeneralSkillsLinkedToTheProjectsQuerySchema,
} from '../validation-schemas/get-all-general-skills-linked-to-the-projects-schema';
import {
  ManageInviteProjectTeamMemberBodySchema,
  ManageInviteProjectTeamMemberParamsSchema,
  manageInviteProjectTeamMemberBodySchema,
  manageInviteProjectTeamMemberParamsSchema,
} from '../validation-schemas/manage-invite-project-team-member-schema';
import {
  ManageProjectTeamMemberPrivilegeAndJobBodySchema,
  ManageProjectTeamMemberPrivilegeAndJobParamsSchema,
  manageProjectTeamMemberPrivilegeAndJobBodySchema,
  manageProjectTeamMemberPrivilegeAndJobParamsSchema,
} from '../validation-schemas/manage-project-team-member-privilege-and-job-schema';
import {
  SendAInviteTeamMemberBodySchema,
  SendAInviteTeamMemberParamsSchema,
  sendAInviteTeamMemberBodySchema,
  sendAInviteTeamMemberParamsSchema,
} from '../validation-schemas/send-invite-team-member-schema';
import {
  UpdateProjectBodySchema,
  updateProjectBodySchema,
} from '../validation-schemas/update-project-schema';
import { FetchProjectsByUserIdViewModel } from '../view-models/fetch-projects-by-user-id-view-model';
import { FetchProjectsInvolvedByUserIdViewModel } from '../view-models/fetch-projects-involved-by-user-id-view-model';
import { FetchProjectsWithShortDetailsViewModel } from '../view-models/fetch-projects-with-short-details-view-model';
import { GetAllGeneralSkillsLinkedToTheProjectsViewModel } from '../view-models/get-all-general-skills-linked-to-the-projects-view-model';
import { GetProjectDetailsBySlugViewModel } from '../view-models/get-project-details-by-slug-view-model';
import { GetProjectsDetailsViewModel } from '../view-models/get-project-details-view-model';

@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly fetchProjectsByUserIdUseCase: FetchProjectsByUserIdUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly sendInviteProjectTeamMemberUseCase: SendInviteProjectTeamMemberUseCase,
    private readonly manageInviteProjectTeamMemberUseCase: ManageInviteProjectTeamMemberUseCase,
    private readonly manageProjectTeamMemberPrivilegeAndJobUseCase: ManageProjectTeamMemberPrivilegeAndJobUseCase,
    private readonly addInterestedInProject: AddInterestedInProject,
    private readonly fetchProjectsWithShortDetailsUseCase: FetchProjectsWithShortDetailsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly fetchGeneralSkillsFromProjectsUseCase: FetchGeneralSkillsFromProjectsUseCase,
    private readonly getProjectBySlugUseCase: GetProjectBySlugUseCase,
    private readonly editProjectUseCase: EditProjectUseCase,
    private readonly fetchProjectsInvolvedByUserId: FetchProjectsInvolvedByUserIdUseCase,
  ) {}

  @Post()
  async createProject(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createProjectBodySchema))
    body: CreateProjectBodySchema,
  ) {
    const { userId } = user;

    const {
      description,
      jobs,
      availableToParticipate,
      generalSkills,
      name,
      bannerUrl,
      imageUrl,
    } = body;

    const result = await this.createProjectUseCase.execute({
      authorId: userId,
      name,
      jobs,
      generalSkills,
      availableToParticipate,
      description,
      bannerUrl,
      imageUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AlreadyExistsError:
          throw new ConflictException({
            statusCode: 409,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Put('/:projectId')
  @HttpCode(200)
  async updateProject(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Body(new ZodValidationPipe(updateProjectBodySchema))
    body: UpdateProjectBodySchema,
  ) {
    const { userId } = user;

    const {
      description,
      jobs,
      availableToParticipate,
      generalSkills,
      name,
      bannerUrl,
      imageUrl,
    } = body;

    const result = await this.editProjectUseCase.execute({
      recipientId: userId,
      name,
      jobs,
      generalSkills,
      availableToParticipate,
      description,
      bannerUrl,
      imageUrl,
      projectId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Result:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue(),
          });
        case AlreadyExistsError:
          throw new ConflictException({
            statusCode: 409,
            message: error.errorValue(),
          });
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: 404,
            message: error.errorValue(),
          });
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Get('/general-skills')
  async getAllGeneralSkillsLinkedToTheProjects(
    @Query(
      new ZodValidationPipe(getAllGeneralSkillsLinkedToTheProjectsQuerySchema),
    )
    params: GetAllGeneralSkillsLinkedToTheProjectsQuerySchema,
  ) {
    const { search } = params;

    const result = await this.fetchGeneralSkillsFromProjectsUseCase.execute({
      search,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const generalSkills = result.value.getValue();

    return generalSkills.map((generalSkill) =>
      GetAllGeneralSkillsLinkedToTheProjectsViewModel.toHTTP(generalSkill),
    );
  }

  @Get('/from/:id/details')
  async getProjectDetails(@Param('id') id: string) {
    const result = await this.getProjectByIdUseCase.execute({ projectId: id });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const project = result.value.getValue();

    return GetProjectsDetailsViewModel.toHTTP(project);
  }

  @Get('/me')
  async fetchProjectsByFromUser(@CurrentUser() user: AuthUser) {
    const { userId } = user;

    const result = await this.fetchProjectsByUserIdUseCase.execute({
      userId,
      pageIndex: 1,
      pageSize: 10,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const { data, lastPage, page, perPage, total } = result.value.getValue();

    return {
      data: data.map((item) => FetchProjectsByUserIdViewModel.toHTTP(item)),
      lastPage,
      page,
      perPage,
      total,
    };
  }

  @Get('/me/involved')
  async fetchProjectsInvolvedFromUser(@CurrentUser() user: AuthUser) {
    const { userId } = user;

    const result = await this.fetchProjectsInvolvedByUserId.execute({
      userId,
      pageIndex: 1,
      pageSize: 10,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const { data, lastPage, page, perPage, total } = result.value.getValue();

    return {
      data: data.map((item) =>
        FetchProjectsInvolvedByUserIdViewModel.toHTTP(item),
      ),
      lastPage,
      page,
      perPage,
      total,
    };
  }

  @Get('/short/details')
  async fetchProjectsWithShortDetails(
    @Query(new ZodValidationPipe(fetchProjectsWithShortDetailsQuerySchema))
    params: FetchProjectsWithShortDetailsQuerySchema,
  ) {
    const { date, role, skill, page: pageIndex } = params;

    const result = await this.fetchProjectsWithShortDetailsUseCase.execute({
      date: date ?? 'recent',
      pageIndex: pageIndex ?? 1,
      pageSize: 10,
      roles: role ? role.split(/\s*,\s*/) : [],
      skills: skill ? skill.split(/\s*,\s*/) : [],
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const { data, lastPage, page, perPage, total } = result.value.getValue();

    return {
      data: data.map((item) =>
        FetchProjectsWithShortDetailsViewModel.toHTTP(item),
      ),
      lastPage,
      page,
      perPage,
      total,
    };
  }

  @Delete('/:projectId')
  @HttpCode(200)
  async deleteProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const { userId } = user;

    const result = await this.deleteProjectUseCase.execute({
      projectId,
      authorId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue(),
          });
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Post('/:projectId/invite')
  @HttpCode(204)
  async sendAInviteTeamMember(
    @CurrentUser() user: AuthUser,
    @Param(new ZodValidationPipe(sendAInviteTeamMemberParamsSchema))
    params: SendAInviteTeamMemberParamsSchema,
    @Body(new ZodValidationPipe(sendAInviteTeamMemberBodySchema))
    body: SendAInviteTeamMemberBodySchema,
  ) {
    const { userId } = user;
    const { recipientId } = body;
    const { projectId } = params;

    const result = await this.sendInviteProjectTeamMemberUseCase.execute({
      ownerId: userId,
      projectId,
      recipientId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue().message,
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Post('/:projectId/management/invite')
  @HttpCode(204)
  async manageInviteProjectTeamMember(
    @CurrentUser() user: AuthUser,
    @Param(new ZodValidationPipe(manageInviteProjectTeamMemberParamsSchema))
    params: ManageInviteProjectTeamMemberParamsSchema,
    @Body(new ZodValidationPipe(manageInviteProjectTeamMemberBodySchema))
    body: ManageInviteProjectTeamMemberBodySchema,
  ) {
    const { userId } = user;
    const { status } = body;
    const { projectId } = params;

    const result = await this.manageInviteProjectTeamMemberUseCase.execute({
      memberId: userId,
      projectId,
      status,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue(),
          });
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Put('/:projectId/management/member/:memberId/privilege-and-job')
  @HttpCode(204)
  async manageProjectTeamMemberPrivilegeAndJob(
    @Param(
      new ZodValidationPipe(manageProjectTeamMemberPrivilegeAndJobParamsSchema),
    )
    params: ManageProjectTeamMemberPrivilegeAndJobParamsSchema,
    @Body(
      new ZodValidationPipe(manageProjectTeamMemberPrivilegeAndJobBodySchema),
    )
    body: ManageProjectTeamMemberPrivilegeAndJobBodySchema,
    @CurrentUser() user: AuthUser,
  ) {
    const { userId } = user;
    const { permissionType, jobsId } = body;
    const { projectId, memberId } = params;

    const result =
      await this.manageProjectTeamMemberPrivilegeAndJobUseCase.execute({
        memberId,
        ownerId: userId,
        projectId,
        permissionType,
        jobsId,
      });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue(),
          });
        case ManageProjectTeamMemberPrivilegeAndJobError.InvalidDeleteItSelf:
          throw new UnauthorizedException({
            code: 'unauthorized',
            message: error.errorValue(),
          });
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Post('/interest/in/:projectId')
  @HttpCode(204)
  async addInterestInProject(
    @CurrentUser() user: AuthUser,
    @Param(new ZodValidationPipe(addInterestInProjectParamsSchema))
    params: AddInterestInProjectParamsSchema,
  ) {
    const { userId } = user;
    const { projectId } = params;

    const result = await this.addInterestedInProject.execute({
      projectId,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Result:
          throw new ConflictException({
            statusCode: 409,
            message: error.errorValue(),
          });
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Get('/:slug/management/details')
  async getProjectDetailsBySlug(@Param('slug') slug: string) {
    const result = await this.getProjectBySlugUseCase.execute({
      slug: slug,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue(),
          });
        default:
          Logger.error(error);

          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const project = result.value.getValue();

    return GetProjectDetailsBySlugViewModel.toHTTP(project);
  }
}
