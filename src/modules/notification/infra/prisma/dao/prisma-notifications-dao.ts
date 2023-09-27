import { PaginationParams } from '@/common/repositories/pagination-params';
import { NotificationsDAO } from '@/modules/notification/application/dao/notifications-dao';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

import { FindManyByUserIdMapper } from './mappers/find-many-by-user-id-mapper';

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
  ): Promise<any[]> {
    const notifications = await this.prisma.notification.findMany({
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
      take: pageIndex * pageSize,
      skip: (pageIndex - 1) * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map((notification) =>
      FindManyByUserIdMapper.toDomain(notification),
    );
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
