import { faker } from '@faker-js/faker';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import {
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { UserFactory } from '@test/factories/make-user';

import { PrismaDatabaseModule } from '../../prisma/prisma-database.module';
import { CreateProjectDTO } from '../validation-schemas/create-project-dto';
import { HttpModule } from '../http.module';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaDatabaseModule, HttpModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  it('/projects (POST) - create a project', async () => {
    const user = await userFactory.makeUser();

    const createProjectBody: CreateProjectDTO = {
      authorId: user.id,
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.url(),
      status: ProjectStatus.RECRUITING,
      requirements: faker.lorem.paragraph(),
      roles: [{ membersAmount: 1, name: 'role' }],
      technologies: [
        {
          slug: 'technology',
        },
      ],
      name: 'Dev Xperience',
      meeting: {
        date: WEEK_DAYS.SUNDAY,
        occurredTime: '10:00',
        type: MeetingType.WEEKLY,
      },
    };

    await request(app.getHttpServer())
      .post('/projects')
      .send(createProjectBody)
      .expect(201);
  });
});
