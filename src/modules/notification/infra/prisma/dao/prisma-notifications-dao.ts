import { PaginationParams } from '@/common/repositories/pagination-params';
import { NotificationsDAO } from '@/modules/notification/application/dao/notifications-dao';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaNotificationsDAO extends NotificationsDAO {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findUserByAuthorId(authorId: string): Promise<any> {
    const author = this.prisma.user.findUnique({
      where: {
        id: authorId,
      },
      select: {
        name: true,
        avatarUrl: true,
      },
    });

    return author;
  }

  async findManyByUserId(
    userId: string,
    { pageIndex, pageSize }: PaginationParams,
  ) {
    const [notifications, totalNotifications] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: {
          recipientId: userId,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          readAt: true,
          linkTo: true,
          ctaTitle: true,
          type: true,
          authorIdToUser: {
            select: {
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: Number(pageSize),
        skip: (pageIndex - 1) * pageSize,
      }),
      this.prisma.notification.count(),
    ]);

    return {
      total: totalNotifications,
      perPage: pageSize,
      page: pageIndex,
      lastPage: Math.ceil(totalNotifications / pageSize),
      data: notifications,
    };
  }

  async countUnreadByUserId(userId: string) {
    const notificationsAmount = this.prisma.notification.count({
      where: {
        recipientId: userId,
        readAt: null,
      },
    });

    return notificationsAmount;
  }
}
