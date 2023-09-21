import { AppModule } from '@/app.module';
import { PrismaService } from '@/common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import {
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { ProjectFactory } from '@test/factories/make-project';
import { UserFactory } from '@test/factories/make-user';

import { CreateProjectBodySchema } from '../validation-schemas/create-project-schema';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, ProjectFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    projectFactory = moduleRef.get(ProjectFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it('/projects (POST) - create a project', async () => {
    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    const createProjectBody: CreateProjectBodySchema = {
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
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createProjectBody)
      .expect(201);

    const projectOnDatabase = await prisma.project.findFirst({
      where: {
        name: createProjectBody.name,
      },
    });

    expect(projectOnDatabase).toBeTruthy();
  });

  it('/projects/me (GET) - get projects from user', async () => {
    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    await Promise.all([
      projectFactory.makeProject({ authorId: user.id, name: 'Project 01' }),
      projectFactory.makeProject({ authorId: user.id, name: 'Project 02' }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/projects/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      projects: expect.arrayContaining([
        expect.objectContaining({ name: 'Project 01' }),
        expect.objectContaining({ name: 'Project 02' }),
      ]),
    });
  });
});
