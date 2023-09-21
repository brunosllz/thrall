import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { ProjectFactory } from '@test/factories/make-project';
import { UserFactory } from '@test/factories/make-user';

import { CreateAnswerBodySchema } from '../validation-schemas/create-answer-schema';

describe('AnswerController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;
  let jwt: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, ProjectFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);

    projectFactory = moduleRef.get(ProjectFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  it('/answer (POST) - create a answer', async () => {
    const userProjectOwner = await userFactory.makeUser();

    const project = await projectFactory.makeProject({
      authorId: userProjectOwner.id,
    });

    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    const createAnswerBody: CreateAnswerBodySchema = {
      content: 'content example',
      projectId: project.id,
    };

    await request(app.getHttpServer())
      .post('/answers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createAnswerBody)
      .expect(201);
  });
});
