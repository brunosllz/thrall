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
import { waitFor } from '@test/factories/utils/wait-for';

import { PrismaDatabaseModule } from '../../prisma/prisma-database.module';
import { CreateProjectBodySchema } from '../validation-schemas/create-project-schema';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaDatabaseModule],
      providers: [UserFactory, ProjectFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    projectFactory = moduleRef.get(ProjectFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('/projects (POST) - create a project', async () => {
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

  test('/projects/me (GET) - get projects from user', async () => {
    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    await Promise.all([
      projectFactory.makeProject({ authorId: user.id, name: 'Project 01' }),
      projectFactory.makeProject({ authorId: user.id, name: 'Project 02' }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/projects/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      projects: expect.arrayContaining([
        expect.objectContaining({ name: 'Project 01' }),
        expect.objectContaining({ name: 'Project 02' }),
      ]),
    });
  });

  test('/projects/:projectId (DELETE) - delete a project', async () => {
    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    const createdProject = await projectFactory.makeProject({
      authorId: user.id,
    });

    await request(app.getHttpServer())
      .delete(`/projects/${createdProject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const projectsOnDatabase = await prisma.project.findMany();

    waitFor(() => {
      expect(projectsOnDatabase).toBeTruthy();
      expect(projectsOnDatabase).toHaveLength(0);
    });
  });

  test('/:projectId/invite (POST) - send a invite team member', async () => {
    const [user1, user2] = await Promise.all([
      userFactory.makeUser(),
      userFactory.makeUser(),
    ]);

    const createdProject = await projectFactory.makeProject({
      authorId: user1.id,
    });

    const accessToken = jwt.sign({ uid: user1.id });

    await request(app.getHttpServer())
      .post(`/projects/${createdProject.id}/invite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ recipientId: user2.id })
      .expect(204);

    const [projectsOnDatabase, teamMembersOnDatabase] = await Promise.all([
      prisma.project.findUnique({
        where: {
          id: createdProject.id,
        },
      }),
      prisma.teamMember.findMany({
        where: {
          projectId: createdProject.id,
        },
      }),
    ]);

    waitFor(() => {
      expect(projectsOnDatabase).toBeTruthy();
      expect(teamMembersOnDatabase).toHaveLength(2);
      expect(teamMembersOnDatabase).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recipientId: user1.id,
            status: 'approved',
          }),
          expect.objectContaining({ recipientId: user2.id, status: 'pending' }),
        ]),
      );
    });
  });
});
