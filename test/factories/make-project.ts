import { MEMBER_STATUS } from '.prisma/client';

import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { PrismaService } from '@common/infra/prisma/prisma.service';
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
      ...override,
    },
    id,
  ).getValue();

  return project;
}

@Injectable()
export class ProjectFactory {
  constructor(private prisma: PrismaService) {}

  async makeProject(data = {} as Overrides) {
    const project = makeFakeProject(data);

    const { rawProject } = ProjectMapper.toPersistence(project);

    await this.prisma.project.create({
      data: rawProject,
    });

    const teamMembers = project.teamMembers.getItems();

    await Promise.all(
      teamMembers.map(async (teamMember) => {
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
    );

    return project;
  }
}
