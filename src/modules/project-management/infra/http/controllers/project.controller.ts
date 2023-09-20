import { AlreadyExistsError } from '@common/errors/errors/already-exists-error';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import { Result } from '@common/logic/result';
import { CreateProjectUseCase } from '@modules/project-management/application/use-cases/commands/create-project';
import { FetchProjectsByUserIdUseCase } from '@modules/project-management/application/use-cases/queries/fetch-projects-by-user-id';
import { MeetingType } from '@modules/project-management/domain/entities/value-objects/meeting';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { CreateProjectDTO } from '../dto/create-project-dto';
import { FetchProjectsByUserIdViewModel } from '../view-models/fetch-projects-by-user-id-view-model';

@Controller('/projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly fetchProjectsByUserIdUseCase: FetchProjectsByUserIdUseCase,
  ) {}

  @Post()
  async createProject(@Body() body: CreateProjectDTO) {
    const {
      authorId,
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
      authorId,
      name,
      requirements,
      roles,
      technologies,
      meeting: {
        date: meeting.date ? meeting.date.toLowerCase() : undefined,
        occurredTime: meeting.occurredTime,
        type: meeting.type.toLowerCase() as MeetingType,
      },
      description,
      status,
      imageUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Result:
          throw new BadRequestException(error.errorValue());
        case AlreadyExistsError:
          throw new ConflictException(error.errorValue());
        default:
          throw new BadRequestException();
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
          throw new BadRequestException(error.errorValue());
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
}
