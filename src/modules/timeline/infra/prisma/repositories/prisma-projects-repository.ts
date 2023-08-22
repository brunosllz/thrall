import { PrismaService } from '@common/infra/prisma/prisma.service';
import { PaginationParams } from '@common/repositories/pagination-params';
import { ProjectsRepository } from '@modules/timeline/application/repositories/projects-repository';
import { Project } from '@modules/timeline/domain/entities/project';
import { Injectable } from '@nestjs/common';

import { ProjectMapper } from '../mappers/project-mapper';

@Injectable()
export class PrismaProjectsRepository extends ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        answer: true,
        projectRole: {
          select: {
            amount: true,
            role: true,
          },
        },
        teamMember: true,
        technology: true,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.toDomain(project);
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: { slug },
      include: {
        answer: true,
        projectRole: {
          select: {
            amount: true,
            role: true,
          },
        },
        teamMember: true,
        technology: true,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.toDomain(project);
  }

  async findManyRecent({ pageIndex, pageSize }: PaginationParams) {
    const projects = await this.prisma.project.findMany({
      include: {
        answer: true,
        projectRole: {
          select: {
            amount: true,
            role: true,
          },
        },
        teamMember: true,
        technology: true,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageIndex * pageSize,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return projects.map((project) => ProjectMapper.toDomain(project));
  }

  async create(project: Project) {
    const { rawProject, rawRoles, rawTechnologies, rawTeamMembers } =
      ProjectMapper.toPersistence(project);

    const rawRolesItems = rawRoles.getItems();
    const rawTechnologiesItems = rawTechnologies.getItems();
    const rawTeamMembersItems = rawTeamMembers.getItems();

    const createdProject = await this.prisma.project.create({
      data: {
        ...rawProject,
      },
    });

    await Promise.all(
      rawRolesItems.map(async (role) => {
        await this.prisma.role.upsert({
          where: {
            name: role.name.value,
          },
          update: {
            projectRole: {
              create: {
                projectId: createdProject.id,
                amount: role.amount,
              },
            },
          },
          create: {
            id: role.id,
            name: role.name.value,
            projectRole: {
              create: {
                projectId: createdProject.id,
                amount: role.amount,
              },
            },
          },
        });
      }),
    );

    await Promise.all(
      rawTechnologiesItems.map(async (technology) => {
        await this.prisma.technology.create({
          data: {
            id: technology.id,
            projectId: createdProject.id,
            slug: technology.slug.value,
          },
        });
      }),
    );

    await Promise.all(
      rawTeamMembersItems.map(async (teamMember) => {
        await this.prisma.teamMember.create({
          data: {
            id: teamMember.id,
            recipientId: teamMember.recipientId,
            permissionType: teamMember.permissionType,
            status: teamMember.status,
            createdAt: teamMember.createdAt,
            projectId: createdProject.id,
            updatedAt: teamMember.updatedAt,
          },
        });
      }),
    );
  }

  async save(project: Project): Promise<void> {
    const { rawProject } = ProjectMapper.toPersistence(project);

    // const { getRemovedItems } = rawRoles;

    // const removedRoles = getRemovedItems();
    // const newRoles = getNewItems();

    // TODO: add manage role on edit a project
    await this.prisma.project.update({
      where: {
        id: rawProject.id,
      },
      data: {
        content: rawProject.content,
        title: rawProject.title,
      },
    });
  }

  async delete(project: Project) {
    const { rawProject } = ProjectMapper.toPersistence(project);

    await this.prisma.project.delete({
      where: {
        id: rawProject.id,
      },
    });
  }
}
