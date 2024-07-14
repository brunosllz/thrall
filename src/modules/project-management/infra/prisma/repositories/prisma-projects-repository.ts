import { Slug } from '@/core/domain/value-objects/slug';
import { DomainEvents } from '@/core/domain/events/domain-events';
import { PrismaService } from '@/core/infra/prisma/prisma.service';
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
        projectJobs: {
          select: {
            id: true,
            membersAmount: true,
            description: true,
            role: {
              select: {
                name: true,
                slug: true,
              },
            },
            member: {
              select: {
                recipientId: true,
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
    const { rawProject, rawProjectJobs, rawSkills, rawTeamMembers } =
      ProjectMapper.toPersistence(project);

    const rawJobsItems = rawProjectJobs.getItems();
    const rawSkillsItems = rawSkills.getItems();
    const rawTeamMembersItems = rawTeamMembers.getItems();

    const createdProject = await this.prisma.project.create({
      data: {
        ...rawProject,
      },
    });

    await Promise.all([
      rawJobsItems.map(async (job) => {
        await this.prisma.role.upsert({
          where: {
            slug: job.slug.value,
          },
          update: {
            projectJobs: {
              create: {
                projectId: createdProject.id,
                membersAmount: job.jobAmountAvailable,
                description: job.description.value,
              },
            },
          },
          create: {
            name: job.name,
            slug: job.slug.value,
            projectJobs: {
              create: {
                projectId: createdProject.id,
                membersAmount: job.jobAmountAvailable,
                description: job.description.value,
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
    const {
      rawProject,
      rawTeamMembers,
      rawInterested,
      rawProjectJobs,
      rawSkills,
    } = ProjectMapper.toPersistence(project);
    const newInterested = rawInterested.getNewItems();
    const newTeamMembers = rawTeamMembers.getNewItems();
    const removedTeamMember = rawTeamMembers.getRemovedItems();
    const removedJobs = rawProjectJobs.getRemovedItems();
    const newSkills = rawSkills.getNewItems();
    const removedSkills = rawSkills.getRemovedItems();

    const hasNewTeamMember = newTeamMembers.length > 0;
    const hasRemovedTeamMember = removedTeamMember.length > 0;
    const hasNewInterested = newInterested.length > 0;
    const hasRemovedJobs = removedJobs.length > 0;
    const hasNewSkills = newSkills.length > 0;
    const hasRemovedSkills = removedSkills.length > 0;

    if (hasNewSkills) {
      await Promise.all([
        newSkills.forEach(async (skill) => {
          await this.prisma.skill.upsert({
            where: {
              slug: skill.slug.value,
            },
            update: {
              projects: {
                connect: {
                  id: rawProject.id,
                },
              },
            },
            create: {
              slug: skill.slug.value,
              projects: {
                connect: {
                  id: rawProject.id,
                },
              },
            },
          });
        }),
      ]);
    }

    if (hasRemovedSkills) {
      await Promise.all([
        removedSkills.forEach(async (skill) => {
          await this.prisma.skill.update({
            where: {
              slug: skill.slug.value,
            },
            data: {
              projects: {
                disconnect: {
                  id: rawProject.id,
                },
              },
            },
          });
        }),
      ]);
    }

    if (hasRemovedJobs) {
      await this.prisma.projectJob.deleteMany({
        where: {
          id: {
            in: removedJobs.map((job) => job.id),
          },
        },
      });
    }

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

    if (hasRemovedTeamMember) {
      await Promise.all(
        removedTeamMember.map(async (teamMember) => {
          await this.prisma.teamMember.delete({
            where: {
              id: teamMember.id,
            },
          });
        }),
      );
    }

    await this.prisma.project.update({
      where: {
        id: rawProject.id,
      },
      data: {
        description: rawProject.description,
        name: rawProject.name,
        slug: rawProject.slug,
        availableTimeUnit: rawProject.availableTimeUnit,
        bannerUrl: rawProject.bannerUrl,
        imageUrl: rawProject.imageUrl,
        availableTimeValue: rawProject.availableTimeValue,
        availableDays: rawProject.availableDays,
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
        projectJobs: {
          upsert: rawProjectJobs.currentItems.map((job) => ({
            where: { id: job.id },
            update: {
              description: job.description.value,
              membersAmount: job.jobAmountAvailable,
              role: {
                connectOrCreate: {
                  where: {
                    slug: job.slug.value,
                  },
                  create: {
                    name: job.name,
                    slug: job.slug.value,
                  },
                },
              },
            },
            create: {
              description: job.description.value,
              membersAmount: job.jobAmountAvailable,
              role: {
                connectOrCreate: {
                  where: {
                    slug: job.slug.value,
                  },
                  create: {
                    name: job.name,
                    slug: job.slug.value,
                  },
                },
              },
            },
          })),
        },
      },
    });

    for (const job of rawProjectJobs.getItems()) {
      const newAssignedMembers = job.membersIdsAssigned.getNewItems();
      const removedAssignedMembers = job.membersIdsAssigned.getRemovedItems();

      if (newAssignedMembers.length > 0) {
        await Promise.all([
          newAssignedMembers.map(async (memberId) => {
            await this.prisma.teamMember.update({
              where: {
                projectId_recipientId: {
                  projectId: rawProject.id,
                  recipientId: memberId,
                },
              },
              data: {
                projectJob: {
                  connect: {
                    id: job.id,
                  },
                },
              },
            });
          }),
        ]);
      }

      if (removedAssignedMembers.length > 0) {
        await Promise.all([
          removedAssignedMembers.map(async (memberId) => {
            await this.prisma.teamMember.update({
              where: {
                projectId_recipientId: {
                  projectId: rawProject.id,
                  recipientId: memberId,
                },
              },
              data: {
                projectJob: {
                  disconnect: {
                    id: job.id,
                  },
                },
              },
            });
          }),
        ]);
      }
    }

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
