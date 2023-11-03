import {
  PaginationValidationSchema,
  paginationValidationSchema,
} from '@/common/infra/http/validation-schemas/pagination-validation-schema';
import { ZodValidationPipe } from '@/common/infra/pipes/zod-validation-pipe';
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
  Query,
} from '@nestjs/common';

import { FetchNotificationsByUserIdViewModel } from '../view-models/fetch-notifications-by-user-id-view-model';

@Controller('/notifications')
export class NotificationsController {
  constructor(
    private readonly fetchNotificationsByUserIdUseCase: FetchNotificationsByUserIdUseCase,
    private readonly readNotificationUseCase: ReadNotificationUseCase,
  ) {}

  @Get('/from/me')
  async fetchNotificationsByUserId(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(paginationValidationSchema))
    pagination: PaginationValidationSchema,
  ) {
    const { pageIndex, pageSize } = pagination;

    const { userId } = user;

    const result = await this.fetchNotificationsByUserIdUseCase.execute({
      userId,
      pageIndex: pageIndex ?? 1,
      pageSize: pageSize ?? 10,
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

    const { data, page, perPage, total, lastPage } = result.value.getValue();

    return {
      page: Number(page),
      perPage: Number(perPage),
      total: String(total),
      lastPage,
      data: data.map((data) =>
        FetchNotificationsByUserIdViewModel.toHTTP(data),
      ),
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
