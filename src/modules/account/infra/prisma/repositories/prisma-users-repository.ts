import { PrismaService } from '@common/infra/prisma/prisma.service';
import { UsersRepository } from '@modules/account/application/repositories/users-repository';
import { User } from '@modules/account/domain/user';

import { UserMapper } from '../mappers/user-mapper';

export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async create(user: User) {
    const raw = UserMapper.toPersistence(user);

    await this.prisma.user.create({
      data: raw,
    });
  }

  async save(user: User) {
    const raw = UserMapper.toPersistence(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: raw,
    });
  }
}
