import { PrismaService } from '@common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import {
  Project,
  ProjectProps,
  ProjectStatus,
} from '@modules/project-management/domain/entities/project';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import {
  Meeting,
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';
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
      meeting: Meeting.create({
        occurredTime: '13:00',
        type: MeetingType.WEEKLY,
        date: WEEK_DAYS.SUNDAY,
      }).getValue(),
      requirements: new Content(faker.lorem.paragraphs()),
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

    return project;
  }
}
