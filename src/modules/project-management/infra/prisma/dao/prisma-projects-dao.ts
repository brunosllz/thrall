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
    const projects = await this.prisma.project.findMany({
      include: {
        technologies: {
          select: {
            slug: true,
          },
        },
      },
      skip: (params.pageIndex - 1) * params.pageSize,
      take: params.pageSize * params.pageIndex,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
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
          take: 3,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
  }

  async findBySlug(slug: string, authorId: string): Promise<any> {
    const project = await this.prisma.project.findUnique({
      where: {
        authorId_slug: {
          authorId,
          slug,
        },
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
    });

    return project;
  }
}
