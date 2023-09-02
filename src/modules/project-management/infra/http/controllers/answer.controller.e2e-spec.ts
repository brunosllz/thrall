import { PrismaDatabaseModule as PrismaDatabaseAccountModule } from '@modules/account/infra/prisma/prisma-database.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { ProjectFactory } from '@test/factories/make-project';
import { UserFactory } from '@test/factories/make-user';

import { PrismaDatabaseModule as PrismaDatabaseTImeLineModule } from '../../prisma/prisma-database.module';
import { CreateAnswerDTO } from '../dto/create-answer-dto';
import { HttpModule } from '../http.module';

describe('AnswerController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaDatabaseTImeLineModule,
        PrismaDatabaseAccountModule,
        HttpModule,
      ],
      providers: [UserFactory, ProjectFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    projectFactory = moduleRef.get(ProjectFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  it('/answer (POST) - create a answer', async () => {
    const mainUser = await userFactory.makeUser();

    const project = await projectFactory.makeProject({
      authorId: mainUser.id,
    });

    const user = await userFactory.makeUser();

    const createAnswerBody: CreateAnswerDTO = {
      authorId: user.id,
      content: 'content example',
      projectId: project.id,
    };

    await request(app.getHttpServer())
      .post('/answers')
      .send(createAnswerBody)
      .expect(201);
  });
});
