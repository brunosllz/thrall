import { NotAllowedError } from '@/common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found-error';
import { DeleteProjectUseCase } from '@/modules/project-management/application/use-cases/commands/delete-project';
import { ManageProjectTeamMemberPrivilegeError } from '@/modules/project-management/application/use-cases/commands/errors/manage-project-team-member-privilege-error';
import { ManageInviteProjectTeamMemberUseCase } from '@/modules/project-management/application/use-cases/commands/manage-invite-project-team-member';
import { ManageProjectTeamMemberPrivilegeUseCase } from '@/modules/project-management/application/use-cases/commands/manage-project-team-member-privilege';
import { SendInviteProjectTeamMemberUseCase } from '@/modules/project-management/application/use-cases/commands/send-invite-project-team-member';
import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import { ZodValidationPipe } from '@common/infra/pipes/zod-validation-pipe';
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
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import {
  CreateProjectBodySchema,
  createProjectBodySchema,
} from '../validation-schemas/create-project-schema';
import {
  ManageInviteProjectTeamMemberBodySchema,
  ManageInviteProjectTeamMemberParamsSchema,
  manageInviteProjectTeamMemberBodySchema,
  manageInviteProjectTeamMemberParamsSchema,
} from '../validation-schemas/manage-invite-project-team-member-schema';
import {
  ManageProjectTeamMemberPrivilegeParamsSchema,
  ManageProjectTeamMemberPrivilegeBodySchema,
  manageProjectTeamMemberPrivilegeBodySchema,
  manageProjectTeamMemberPrivilegeParamsSchema,
} from '../validation-schemas/manage-project-team-member-privilege-schema';
import {
  SendAInviteTeamMemberBodySchema,
  SendAInviteTeamMemberParamsSchema,
  sendAInviteTeamMemberBodySchema,
  sendAInviteTeamMemberParamsSchema,
} from '../validation-schemas/send-invite-team-member-schema';
import { FetchProjectsByUserIdViewModel } from '../view-models/fetch-projects-by-user-id-view-model';

@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly fetchProjectsByUserIdUseCase: FetchProjectsByUserIdUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly sendInviteProjectTeamMemberUseCase: SendInviteProjectTeamMemberUseCase,
    private readonly manageInviteProjectTeamMemberUseCase: ManageInviteProjectTeamMemberUseCase,
    private readonly manageProjectTeamMemberPrivilegeUseCase: ManageProjectTeamMemberPrivilegeUseCase,
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
      requirements,
      roles,
      technologies,
      name,
      meeting,
      status,
      imageUrl,
    } = body;

    const result = await this.createProjectUseCase.execute({
      authorId: userId,
      name,
      requirements,
      roles,
      technologies,
      meeting: {
        date: meeting.date,
        occurredTime: meeting.occurredTime,
        type: meeting.type,
      },
      description,
      status,
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
          Logger.error(error.errorValue());
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Get('/me')
  async fetchProjectsByUserId(@CurrentUser() user: AuthUser) {
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
          Logger.error(error.errorValue());
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }

    const projectsValue = result.value.getValue();

    const projects = projectsValue.map((project) =>
      FetchProjectsByUserIdViewModel.toHTTP(project),
    );

    return {
      projects,
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
            message: error.errorValue().message,
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error.errorValue());
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
          Logger.error(error.errorValue());
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Post('/:projectId/manage/invite')
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
            message: error.errorValue().message,
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error.errorValue());
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }

  @Patch('/:projectId/manage/member/:memberId/privilege')
  @HttpCode(204)
  async ManageProjectTeamMemberPrivilege(
    @Param(new ZodValidationPipe(manageProjectTeamMemberPrivilegeParamsSchema))
    params: ManageProjectTeamMemberPrivilegeParamsSchema,
    @Body(new ZodValidationPipe(manageProjectTeamMemberPrivilegeBodySchema))
    body: ManageProjectTeamMemberPrivilegeBodySchema,
    @CurrentUser() user: AuthUser,
  ) {
    const { userId } = user;
    const { permissionType } = body;
    const { projectId, memberId } = params;

    const result = await this.manageProjectTeamMemberPrivilegeUseCase.execute({
      memberId,
      ownerId: userId,
      projectId,
      permissionType,
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
        case ManageProjectTeamMemberPrivilegeError.InvalidDeleteItSelf:
          throw new UnauthorizedException({
            statusCode: 401,
            message: error.errorValue().message,
          });
        default:
          Logger.error(error.errorValue());
          throw new InternalServerErrorException({
            statusCode: 500,
            massage: 'Internal Server Error',
          });
      }
    }
  }
}
