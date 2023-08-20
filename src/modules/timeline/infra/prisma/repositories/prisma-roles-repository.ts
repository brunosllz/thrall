import { RolesRepository } from '@modules/timeline/application/repositories/roles-repository';
import { Role } from '@modules/timeline/domain/entities/role';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/database/prisma.service';

import { RoleMapper } from '../mappers/role-mapper';

@Injectable()
export class PrismaRolesRepository extends RolesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findManyByProjectId(projectId: string): Promise<Role[]> {
    const roles = await this.prisma.projectRole.findMany({
      where: {
        projectId,
      },
      select: {
        projectId: true,
        amount: true,
        role: true,
      },
    });

    return roles.map((item) => RoleMapper.toDomain(item));
  }

  async deleteManyByProjectId(projectId: string): Promise<void> {
    await this.prisma.projectRole.deleteMany({
      where: {
        projectId,
      },
    });
  }
}
