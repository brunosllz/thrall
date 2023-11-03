import { ResourceNotFoundError } from '@/common/errors/errors/resource-not-found-error';
import { GetUserUseCase } from '@/modules/account/application/use-cases/queries/get-user';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import {
  InternalServerErrorException,
  Controller,
  Get,
  Logger,
  BadRequestException,
} from '@nestjs/common';

@Controller('/users')
export class UsersController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get('/me')
  async getUserById(@CurrentUser() user: AuthUser) {
    const { userId } = user;

    const result = await this.getUserUseCase.execute({
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException({
            statusCode: 400,
            message: error.errorValue().message,
          });

        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
          });
      }
    }

    const foundedUser = result.value.getValue();

    return {
      user: foundedUser,
    };
  }
}
