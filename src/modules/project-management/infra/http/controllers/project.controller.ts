import { NotAllowedError } from '@/common/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found-error';
import { DeleteProjectUseCase } from '@/modules/project-management/application/use-cases/commands/delete-project';
import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import { ZodValidationPipe } from '@common/infra/pipes/zod-validation-pipe';
import { Result } from '@common/logic/result';
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
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import {
  CreateProjectBodySchema,
  createProjectBodySchema,
} from '../validation-schemas/create-project-schema';
import { FetchProjectsByUserIdViewModel } from '../view-models/fetch-projects-by-user-id-view-model';

@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly fetchProjectsByUserIdUseCase: FetchProjectsByUserIdUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
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
        case Result:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue().message,
          });
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
        case Result:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue().message,
          });
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
}
