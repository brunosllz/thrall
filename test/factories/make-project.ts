import { PrismaService } from '@common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import {
  Project,
  ProjectProps,
  ProjectStatus,
} from '@modules/project-management/domain/entities/project';
import {
  PeriodIdentifier,
  Requirement,
} from '@modules/project-management/domain/entities/value-objects/requirement';
import { ProjectMapper } from '@modules/project-management/infra/prisma/mappers/project-mapper';
import { Injectable } from '@nestjs/common';

type Overrides = Partial<ProjectProps>;

export function makeFakeProject(override = {} as Overrides, id?: string) {
  const requirement = Requirement.create({
    content: faker.lorem.paragraphs(),
    periodAmount: faker.number.int({
      max: 10,
      min: 2,
    }),
    periodIdentifier: PeriodIdentifier.WEEK,
  }).getValue();

  const project = Project.create(
    {
      authorId: faker.string.uuid(),
      description: faker.lorem.paragraphs(),
      name: faker.lorem.text(),
      imageUrl: faker.image.url(),
      status: ProjectStatus.RECRUITING,
      requirement,
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
