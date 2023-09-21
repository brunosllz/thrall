import { FetchNotificationsByUserIdUseCase } from '@/modules/notification/application/use-cases/queries/fetch-notifications-by-user-id';
import { AuthUser } from '@common/infra/http/auth/auth-user';
import { CurrentUser } from '@common/infra/http/auth/decorators/current-user';
import { BadRequestException, Controller, Get } from '@nestjs/common';

@Controller('/notifications')
export class NotificationController {
  constructor(
    private readonly fetchNotificationsByUserIdUseCase: FetchNotificationsByUserIdUseCase,
  ) {}

  @Get()
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
          throw new BadRequestException({
            statusCode: 400,
          });
      }
    }

    const notifications = result.value;

    // const projects = projectsValue.map((project) =>
    //   FetchProjectsByUserIdViewModel.toHTTP(project),
    // );

    return {
      notifications,
    };
  }
}
