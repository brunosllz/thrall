import { PrismaService } from '@common/infra/prisma/prisma.service';
import {
  PaginationParams,
  PaginationQueryResponse,
} from '@common/repositories/pagination-params';
import {
  ProjectQueryParams,
  ProjectsDAO,
} from '@modules/project-management/application/dao/projects-dao';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class PrismaProjectsDAO extends ProjectsDAO {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findDetailsById(projectId: string) {
    const project = this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        imageUrl: true,
        bannerUrl: true,
        name: true,
        description: true,
        availableDays: true,
        availableTimeUnit: true,
        availableTimeValue: true,
        authorId: true,
        projectRoles: {
          select: {
            id: true,
            membersAmount: true,
            description: true,
            role: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            membersAmount: 'desc',
          },
        },
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        skills: {
          select: {
            slug: true,
          },
        },
        interestedInProject: {
          select: {
            userId: true,
          },
        },
        createdAt: true,
      },
    });

    return project;
  }

  async findManyWithShortDetails(
    { date, roles, skills }: ProjectQueryParams,
    { pageIndex, pageSize }: PaginationParams,
  ): Promise<PaginationQueryResponse> {
    const dateParams: Prisma.DateTimeFilter<'Project'> | undefined =
      date === 'day'
        ? {
            gte: dayjs().startOf('day').toDate(),
          }
        : date === 'week'
        ? {
            gte: dayjs().subtract(1, 'week').toDate(),
          }
        : date === 'month'
        ? {
            gte: dayjs().subtract(1, 'month').toDate(),
          }
        : undefined;

    const skillsParams: Prisma.SkillListRelationFilter | undefined =
      skills.length > 0
        ? {
            some: {
              slug: {
                in: skills,
              },
            },
          }
        : undefined;

    const rolesParams: Prisma.ProjectRoleListRelationFilter | undefined =
      roles.length > 0
        ? {
            some: {
              role: {
                name: {
                  in: roles,
                },
              },
            },
          }
        : undefined;

    const [projects, totalProjects] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where: {
          AND: [
            {
              skills: skillsParams,
            },
            {
              projectRoles: rolesParams,
            },
            {
              createdAt: dateParams,
            },
            {
              status: 'recruiting',
            },
          ],
        },
        select: {
          id: true,
          imageUrl: true,
          name: true,
          description: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              role: true,
            },
          },
          skills: {
            select: {
              slug: true,
            },
          },
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count({
        where: {
          AND: [
            {
              skills: skillsParams,
            },
            {
              projectRoles: rolesParams,
            },
            {
              createdAt: dateParams,
            },
          ],
        },
      }),
    ]);

    return {
      data: projects,
      perPage: pageSize,
      page: pageIndex,
      lastPage: Math.ceil(totalProjects / pageSize),
      total: totalProjects,
    };
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
        skills: {
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
      take: pageSize,
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
        skills: {
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
