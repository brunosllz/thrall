import { UsersDAO } from '@/modules/account/application/dao/users-dao';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUsersDAO extends UsersDAO {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
