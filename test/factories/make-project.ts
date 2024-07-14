import { MEMBER_STATUS } from '.prisma/client';

import { Skill } from '@/modules/project-management/domain/entities/skill';
import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
import { PrismaService } from '@/core/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import {
  Project,
  ProjectProps,
  ProjectStatus,
} from '@modules/project-management/domain/entities/project';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { ProjectMapper } from '@modules/project-management/infra/prisma/repositories/mappers/project-mapper';
import { Injectable } from '@nestjs/common';

type Overrides = Partial<ProjectProps>;

export function makeFakeProject(override = {} as Overrides, id?: string) {
  const project = Project.create(
    {
      authorId: faker.string.uuid(),
      description: new Content(faker.lorem.paragraphs()),
      name: faker.lorem.text(),
      imageUrl: faker.image.url(),
      status: ProjectStatus.RECRUITING,
      availableToParticipate: {
        value: {
          availableDays: [1, 3, 5],
          availableTime: {
            unit: UnitTimeType.HOUR,
            value: 2,
          },
        },
      },
      bannerUrl: faker.image.url(),
      generalSkills: new ProjectGeneralSkillList([
        Skill.create('react').getValue(),
        // Skill.create('javascript').getValue(),
        // Skill.create('typescript').getValue(),
      ]),
      ...override,
    },
    id,
  ).getValue();

  return project;
}

@Injectable()
export class ProjectFactory {
  constructor(private prisma: PrismaService) {}

  async makeProject(data = {} as Overrides, id?: string) {
    const project = makeFakeProject(data, id);

    const { rawProject, rawTeamMembers, rawProjectJobs } =
      ProjectMapper.toPersistence(project);

    await this.prisma.project.create({
      data: rawProject,
    });

    const teamMembers = rawTeamMembers.getItems();
    const jobs = rawProjectJobs.getItems();

    await Promise.all([
      jobs.forEach(async (job) => {
        await this.prisma.role.create({
          data: {
            name: job.name,
            slug: job.slug.value,
            projectJobs: {
              create: {
                id: job.id ?? undefined,
                projectId: project.id,
                membersAmount: job.jobAmountAvailable,
                description: job.description.value,
              },
            },
          },
        });
      }),
    ]);

    await Promise.all([
      teamMembers.forEach(async (teamMember) => {
        await this.prisma.teamMember.create({
          data: {
            id: teamMember.id,
            recipientId: teamMember.recipientId,
            permissionType: teamMember.permissionType,
            status: teamMember.status as MEMBER_STATUS,
            createdAt: teamMember.createdAt,
            projectId: project.id,
            updatedAt: teamMember.updatedAt,
          },
        });
      }),
    ]);

    return project;
  }
}
