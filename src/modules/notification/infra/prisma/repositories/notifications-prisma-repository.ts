import { PrismaService } from '@common/infra/prisma/prisma.service';
import { NotificationsRepository } from '@modules/notification/application/repositories/notifications-repository';
import { Notification } from '@modules/notification/domain/entities/notification';
import { Injectable } from '@nestjs/common';

import { NotificationMapper } from '../mappers/notification-mapper';

@Injectable()
export class PrismaNotificationsRepository extends NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return NotificationMapper.toDomain(notification);
  }

  async create(notification: Notification) {
    const raw = NotificationMapper.toPersistence(notification);

    await this.prisma.notification.create({
      data: raw,
    });
  }

  async save(notification: Notification) {
    const raw = NotificationMapper.toPersistence(notification);

    await this.prisma.notification.update({
      where: {
        id: raw.id,
      },
      data: {
        readAt: raw.readAt,
      },
    });
  }
}
