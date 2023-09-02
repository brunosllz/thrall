import { PrismaService } from '@common/infra/prisma/prisma.service';
import { RolesRepository } from '@modules/project-management/application/repositories/roles-repository';
import { Role } from '@modules/project-management/domain/entities/role';
import { Injectable } from '@nestjs/common';

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
        membersAmount: true,
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
