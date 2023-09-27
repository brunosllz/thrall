import { PrismaService } from '@common/infra/prisma/prisma.service';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { Project } from '@modules/project-management/domain/entities/project';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';
import { Injectable } from '@nestjs/common';
import { MEMBER_STATUS } from '@prisma/client';

import { ProjectMapper } from './mappers/project-mapper';

@Injectable()
export class PrismaProjectsRepository extends ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async exists({ authorId, slug }: { authorId: string; slug: Slug }) {
    const projectAllReadyExists = await this.prisma.project.findUnique({
      where: {
        authorId_slug: { authorId, slug: slug.value },
      },
    });

    if (projectAllReadyExists) {
      return true;
    }

    return false;
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        answers: true,
        projectRoles: {
          select: {
            membersAmount: true,
            role: true,
          },
        },
        teamMembers: true,
        technologies: true,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.toDomain(project);
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
            projectRoles: {
              create: {
                projectId: createdProject.id,
                membersAmount: role.membersAmount,
              },
            },
          },
          create: {
            id: role.id,
            name: role.name.value,
            projectRoles: {
              create: {
                projectId: createdProject.id,
                membersAmount: role.membersAmount,
              },
            },
          },
        });
      }),
    );

    await Promise.all(
      rawTechnologiesItems.map(async (technology) => {
        await this.prisma.technology.upsert({
          where: {
            slug: technology.slug.value,
          },
          update: {
            projects: {
              connect: {
                id: createdProject.id,
              },
            },
          },
          create: {
            id: technology.id,
            slug: technology.slug.value,
            projects: {
              connect: {
                id: createdProject.id,
              },
            },
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
            status: teamMember.status as MEMBER_STATUS,
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
        description: rawProject.description,
        name: rawProject.name,
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