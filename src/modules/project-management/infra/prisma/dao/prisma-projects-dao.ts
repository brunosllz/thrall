import { PrismaService } from '@common/infra/prisma/prisma.service';
import { PaginationParams } from '@common/repositories/pagination-params';
import { ProjectsDAO } from '@modules/project-management/application/dao/projects-dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaProjectsDAO extends ProjectsDAO {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findManyRecent(params: PaginationParams): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async findManyByUserId(
    userId: string,
    { pageIndex, pageSize }: PaginationParams,
  ): Promise<any[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        authorId: userId,
      },
      include: {
        technologies: {
          select: {
            slug: true,
          },
        },
        _count: {
          select: {
            teamMembers: true,
            answers: true,
          },
        },
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize * pageIndex,
    });

    return projects;
  }

  async findBySlug(slug: string, authorId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
