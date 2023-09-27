import { FetchNotificationsByUserIdUseCase } from '@/modules/notification/application/use-cases/queries/fetch-notifications-by-user-id';
import { ReadNotificationUseCase } from '@/modules/notification/application/use-cases/read-notification';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import {
  InternalServerErrorException,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Logger,
} from '@nestjs/common';

@Controller('/notifications')
export class NotificationController {
  constructor(
    private readonly fetchNotificationsByUserIdUseCase: FetchNotificationsByUserIdUseCase,
    private readonly readNotificationUseCase: ReadNotificationUseCase,
  ) {}

  @Get('/from/me')
  async fetchNotificationsByUserId(@CurrentUser() user: AuthUser) {
    const { userId } = user;

    const result = await this.fetchNotificationsByUserIdUseCase.execute({
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
          });
      }
    }

    const notifications = result.value.getValue();

    return {
      notifications,
    };
  }

  @HttpCode(204)
  @Patch('/:notificationId/read')
  async readNotificationFromUser(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const { userId } = user;

    const result = await this.readNotificationUseCase.execute({
      notificationId: notificationId,
      recipientId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          Logger.error(error);
          throw new InternalServerErrorException({
            statusCode: 500,
          });
      }
    }
  }
}
