import { Slug } from '@/common/domain/entities/value-objects/slug';
import { DomainEvents } from '@/common/domain/events/domain-events';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { Project } from '@modules/project-management/domain/entities/project';
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
            description: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teamMembers: true,
        skills: true,
        interestedInProject: true,
      },
    });

    if (!project) {
      return null;
    }

    return ProjectMapper.toDomain(project);
  }

  async create(project: Project) {
    const { rawProject, rawRoles, rawSkills, rawTeamMembers } =
      ProjectMapper.toPersistence(project);

    const rawRolesItems = rawRoles.getItems();
    const rawSkillsItems = rawSkills.getItems();
    const rawTeamMembersItems = rawTeamMembers.getItems();

    const createdProject = await this.prisma.project.create({
      data: {
        ...rawProject,
      },
    });

    await Promise.all([
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
                description: role.description.value,
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
                description: role.description.value,
              },
            },
          },
        });
      }),
      rawSkillsItems.map(async (skill) => {
        await this.prisma.skill.upsert({
          where: {
            slug: skill.slug.value,
          },
          update: {
            projects: {
              connect: {
                id: createdProject.id,
              },
            },
          },
          create: {
            id: skill.id,
            slug: skill.slug.value,
            projects: {
              connect: {
                id: createdProject.id,
              },
            },
          },
        });
      }),
      rawTeamMembersItems.map(async (teamMember) => {
        await this.prisma.teamMember.create({
          data: {
            id: teamMember.id,
            recipientId: teamMember.recipientId,
            permissionType: teamMember.permissionType,
            status: teamMember.status as MEMBER_STATUS,
            createdAt: teamMember.createdAt,
            projectId: createdProject.id,
            updatedAt: teamMember.updatedAt ?? null,
          },
        });
      }),
    ]);
  }

  async save(project: Project): Promise<void> {
    const { rawProject, rawTeamMembers, rawInterested } =
      ProjectMapper.toPersistence(project);
    const newTeamMembers = rawTeamMembers.getNewItems();
    const newInterested = rawInterested.getNewItems();

    const hasNewTeamMember = newTeamMembers.length > 0;
    const hasNewInterested = newInterested.length > 0;

    if (hasNewInterested) {
      await Promise.all(
        newInterested.map(async (interested) => {
          await this.prisma.interestedInProject.create({
            data: {
              userId: interested.recipientId,
              projectId: rawProject.id,
            },
          });
        }),
      );
    }

    if (hasNewTeamMember) {
      await Promise.all(
        newTeamMembers.map(async (teamMember) => {
          await this.prisma.teamMember.create({
            data: {
              id: teamMember.id,
              recipientId: teamMember.recipientId,
              permissionType: teamMember.permissionType,
              status: teamMember.status as MEMBER_STATUS,
              createdAt: teamMember.createdAt,
              projectId: rawProject.id,
              updatedAt: teamMember.updatedAt,
            },
          });
        }),
      );
    }

    // TODO: add manage role on edit a project
    await this.prisma.project.update({
      where: {
        id: rawProject.id,
      },
      data: {
        description: rawProject.description,
        name: rawProject.name,
        teamMembers: {
          updateMany: rawTeamMembers.getItems().map((teamMember) => ({
            where: { id: teamMember.id },
            data: {
              permissionType: teamMember.permissionType,
              status: teamMember.status as MEMBER_STATUS,
              updatedAt: teamMember.updatedAt,
            },
          })),
        },
      },
    });

    DomainEvents.dispatchEventsForAggregate(project.id);
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
