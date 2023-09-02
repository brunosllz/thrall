import { PeriodIdentifier } from '@modules/project-management/domain/entities/value-objects/requirement';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { UserFactory } from '@test/factories/make-user';

import { PrismaDatabaseModule } from '../../prisma/prisma-database.module';
import { CreateProjectDTO } from '../dto/create-project-dto';
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
      content: 'content',
      requirement: {
        content: 'content',
        periodAmount: 1,
        periodIdentifier: PeriodIdentifier.WEEK,
      },
      roles: [{ membersAmount: 1, name: 'role' }],
      technologies: [
        {
          slug: 'technology',
        },
      ],
      title: 'title',
    };

    await request(app.getHttpServer())
      .post('/projects')
      .send(createProjectBody)
      .expect(201);
  });
});
