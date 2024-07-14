import { AppModule } from '@/app.module';
import { PrismaService } from '@/core/infra/prisma/prisma.service';
import {
  Member,
  MemberStatus,
  PermissionType,
} from '@/modules/project-management/domain/entities/member';
import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { MembersIdsAssignedList } from '@/modules/project-management/domain/entities/watched-lists/members-ids-assigned-list';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import { TeamMembersList } from '@/modules/project-management/domain/entities/watched-lists/team-members-list';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { makeFakeJob } from '@test/factories/make-job';
import { ProjectFactory } from '@test/factories/make-project';
import { UserFactory } from '@test/factories/make-user';
import { waitFor } from '@test/factories/utils/wait-for';

import { PrismaDatabaseModule } from '../../prisma/prisma-database.module';
import { CreateProjectBodySchema } from '../validation-schemas/create-project-schema';
import { UpdateProjectBodySchema } from '../validation-schemas/update-project-schema';

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
      bannerUrl: faker.image.url(),
      jobs: [
        {
          jobAmountAvailable: 1,
          name: 'devops',
          description: faker.lorem.paragraph(),
        },
        {
          jobAmountAvailable: 4,
          name: 'front end',
          description: faker.lorem.paragraph(),
        },
      ],
      generalSkills: [
        {
          slug: 'javascript',
        },
        {
          slug: 'typescript',
        },
      ],
      name: 'Dev Xperience',
      availableToParticipate: {
        availableDays: [1, 3, 5],
        availableTime: {
          unit: UnitTimeType.HOUR,
          value: 2,
        },
      },
    };

    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createProjectBody)
      .expect(201);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const projectOnDatabase = await prisma.project.findFirst({
      where: {
        name: createProjectBody.name,
      },
      include: {
        projectJobs: true,
        skills: true,
      },
    });

    await waitFor(() => {
      expect(projectOnDatabase).toBeTruthy();
      expect(projectOnDatabase?.projectJobs).toHaveLength(2);
      expect(projectOnDatabase?.skills).toHaveLength(2);
    }, 3000);
  });

  test('/projects/:projectId (PUT) - update a project', async () => {
    const user = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user.id });

    const createdProject = await projectFactory.makeProject({
      authorId: user.id,
      name: 'Project 01',
    });

    const role = await prisma.role.create({
      data: {
        name: 'devops',
        slug: 'devops',
      },
    });

    const [projectJob] = await Promise.all([
      prisma.projectJob.create({
        data: {
          projectId: createdProject.id,
          description: faker.lorem.paragraph(),
          membersAmount: 5,
          roleSlug: role.slug,
        },
      }),
      prisma.skill.create({
        data: {
          slug: 'java',
          projects: {
            connect: {
              id: createdProject.id,
            },
          },
        },
      }),
      prisma.skill.create({
        data: {
          slug: 'prisma',
          projects: {
            connect: {
              id: createdProject.id,
            },
          },
        },
      }),
    ]);

    const getCreateProject = await prisma.project.findUnique({
      where: {
        id: createdProject.id,
      },
      include: {
        skills: true,
        projectJobs: true,
      },
    });

    await waitFor(() => {
      expect(getCreateProject).toBeTruthy();
      expect(getCreateProject?.skills).toHaveLength(2);
      expect(getCreateProject?.skills).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ slug: 'java' }),
          expect.objectContaining({ slug: 'prisma' }),
        ]),
      );
      expect(getCreateProject?.projectJobs).toHaveLength(1);
      expect(getCreateProject?.projectJobs[0].membersAmount).toEqual(5);
    });

    const updateProjectBody: UpdateProjectBodySchema = {
      description: 'example description',
      name: 'example project name',
      generalSkills: [
        {
          slug: 'prisma',
        },
        {
          slug: 'java',
        },
        {
          slug: 'react',
        },
        {
          slug: 'typescript',
        },
      ],
      jobs: [
        {
          id: projectJob.id,
          name: 'full stack',
          jobAmountAvailable: 8,
          description: 'example description',
        },
        {
          name: 'front end',
          jobAmountAvailable: 3,
          description: 'lorem',
        },
      ],
    };

    await request(app.getHttpServer())
      .put(`/projects/${createdProject.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateProjectBody)
      .expect(200);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const projectsOnDatabase = await prisma.project.findUnique({
      where: {
        id: createdProject.id,
      },
      include: {
        skills: true,
        projectJobs: true,
      },
    });

    await waitFor(() => {
      expect(projectsOnDatabase).toBeTruthy();
      expect(projectsOnDatabase?.name).toEqual(updateProjectBody.name);
      expect(projectsOnDatabase?.description).toEqual(
        updateProjectBody.description,
      );
      expect(projectsOnDatabase?.skills).toHaveLength(4);
      expect(projectsOnDatabase?.skills).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ slug: 'java' }),
          expect.objectContaining({ slug: 'react' }),
          expect.objectContaining({ slug: 'typescript' }),
        ]),
      );
      expect(projectsOnDatabase?.projectJobs).toHaveLength(2);
      expect(projectsOnDatabase?.projectJobs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'example description',
            membersAmount: 8,
          }),
          expect.objectContaining({
            description: 'lorem',
            membersAmount: 3,
          }),
        ]),
      );
    });
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

    await waitFor(() => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ name: 'Project 01' }),
            expect.objectContaining({ name: 'Project 02' }),
          ]),
        }),
      );
      expect(response.body.total).toEqual(2);
    });
  });

  test('/projects/me/involved (GET) - get projects involved from user', async () => {
    const user1 = await userFactory.makeUser();
    const user2 = await userFactory.makeUser();
    const accessToken = jwt.sign({ uid: user1.id });

    await Promise.all([
      projectFactory.makeProject({
        authorId: user2.id,
        name: 'Project 01',
        teamMembers: new TeamMembersList([
          Member.create({
            permissionType: PermissionType.OWNER,
            recipientId: user2.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
          Member.create({
            permissionType: PermissionType.MEMBER,
            recipientId: user1.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
        ]),
      }),
      projectFactory.makeProject({
        authorId: user2.id,
        name: 'Project 02',
        teamMembers: new TeamMembersList([
          Member.create({
            permissionType: PermissionType.OWNER,
            recipientId: user2.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
          Member.create({
            permissionType: PermissionType.MEMBER,
            recipientId: user1.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
        ]),
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/projects/me/involved')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    await waitFor(() => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ name: 'Project 01' }),
            expect.objectContaining({ name: 'Project 02' }),
          ]),
        }),
      );
      expect(response.body.total).toEqual(2);
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

    await waitFor(() => {
      expect(projectsOnDatabase).toBeTruthy();
      expect(projectsOnDatabase).toHaveLength(0);
    });
  });

  test('/projects/:projectId/invite (POST) - send a invite team member', async () => {
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

    const teamMembersOnDatabase = await prisma.teamMember.findMany({
      where: {
        projectId: createdProject.id,
      },
    });

    await waitFor(() => {
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

  test('/projects/:projectId/management/invite (POST) - manage invite of a team member', async () => {
    const [user1, user2, user3] = await Promise.all([
      userFactory.makeUser(),
      userFactory.makeUser(),
      userFactory.makeUser(),
    ]);

    const createdProject = await projectFactory.makeProject({
      authorId: user1.id,
    });

    const accessTokenUser1 = jwt.sign({ uid: user1.id });
    const accessTokenUser2 = jwt.sign({ uid: user2.id });
    const accessTokenUser3 = jwt.sign({ uid: user3.id });

    await request(app.getHttpServer())
      .post(`/projects/${createdProject.id}/invite`)
      .set('Authorization', `Bearer ${accessTokenUser1}`)
      .send({ recipientId: user2.id })
      .expect(204);

    await request(app.getHttpServer())
      .post(`/projects/${createdProject.id}/invite`)
      .set('Authorization', `Bearer ${accessTokenUser1}`)
      .send({ recipientId: user3.id })
      .expect(204);

    await request(app.getHttpServer())
      .post(`/projects/${createdProject.id}/management/invite`)
      .set('Authorization', `Bearer ${accessTokenUser2}`)
      .send({ status: 'approved' })
      .expect(204);

    await request(app.getHttpServer())
      .post(`/projects/${createdProject.id}/management/invite`)
      .set('Authorization', `Bearer ${accessTokenUser3}`)
      .send({ status: 'rejected' })
      .expect(204);

    const teamMembersOnDatabase = await prisma.teamMember.findMany({
      where: {
        projectId: createdProject.id,
      },
    });

    await waitFor(() => {
      expect(teamMembersOnDatabase).toHaveLength(3);
      expect(teamMembersOnDatabase).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recipientId: user1.id,
            status: 'approved',
          }),
          expect.objectContaining({
            recipientId: user2.id,
            status: 'approved',
          }),
          expect.objectContaining({
            recipientId: user3.id,
            status: 'rejected',
          }),
        ]),
      );
    });
  });

  test('/projects/:projectId/management/member/:memberId/privilege-and-job (PUT) - manage privilege and assign job of a team member', async () => {
    const [user1, user2] = await Promise.all([
      userFactory.makeUser(),
      userFactory.makeUser(),
    ]);

    const PROJECT_JOB_ID = faker.string.uuid();
    const PROJECT_ID = faker.string.uuid();

    const createdProject = await projectFactory.makeProject(
      {
        authorId: user1.id,
        teamMembers: new TeamMembersList([
          Member.create({
            permissionType: PermissionType.OWNER,
            recipientId: user1.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
          Member.create({
            permissionType: PermissionType.MEMBER,
            recipientId: user2.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
        ]),
        jobs: new ProjectJobList([
          makeFakeJob(
            {
              jobAmountAvailable: 2,
              projectId: PROJECT_ID,
            },
            PROJECT_JOB_ID,
          ),
        ]),
      },
      PROJECT_ID,
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    const accessToken = jwt.sign({ uid: user1.id });

    await request(app.getHttpServer())
      .put(
        `/projects/${createdProject.id}/management/member/${user2.id}/privilege-and-job`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        permissionType: 'owner',
        jobsId: [PROJECT_JOB_ID],
      })
      .expect(204);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const teamMembersOnDatabase = await prisma.teamMember.findMany({
      where: {
        projectId: createdProject.id,
      },
    });

    const projectJobsOnDatabase = await prisma.projectJob.findMany({
      where: {
        projectId: createdProject.id,
      },
      include: {
        member: true,
      },
    });

    await waitFor(() => {
      expect(teamMembersOnDatabase).toHaveLength(2);
      expect(teamMembersOnDatabase).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recipientId: user1.id,
            status: 'approved',
            permissionType: 'owner',
          }),
          expect.objectContaining({
            recipientId: user2.id,
            status: 'approved',
            permissionType: 'owner',
          }),
        ]),
      );
      expect(projectJobsOnDatabase).toHaveLength(1);
      expect(projectJobsOnDatabase[0].member).toHaveLength(1);
      expect(projectJobsOnDatabase[0].member[0].recipientId).toEqual(user2.id);
    });
  });

  test('/projects/:projectId/management/member/:memberId/privilege-and-job (PUT) - manage privilege and remove job of a team member', async () => {
    const [user1, user2] = await Promise.all([
      userFactory.makeUser(),
      userFactory.makeUser(),
    ]);

    const PROJECT_JOB_ID = faker.string.uuid();
    const PROJECT_ID = faker.string.uuid();

    const createdProject = await projectFactory.makeProject(
      {
        authorId: user1.id,
        teamMembers: new TeamMembersList([
          Member.create({
            permissionType: PermissionType.OWNER,
            recipientId: user1.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
          Member.create({
            permissionType: PermissionType.MEMBER,
            recipientId: user2.id,
            status: MemberStatus.APPROVED,
          }).getValue(),
        ]),
        jobs: new ProjectJobList([
          makeFakeJob(
            {
              jobAmountAvailable: 2,
              projectId: PROJECT_ID,
              membersIdsAssigned: new MembersIdsAssignedList([user2.id]),
            },
            PROJECT_JOB_ID,
          ),
        ]),
      },
      PROJECT_ID,
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const accessToken = jwt.sign({ uid: user1.id });

    await request(app.getHttpServer())
      .put(
        `/projects/${createdProject.id}/management/member/${user2.id}/privilege-and-job`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        permissionType: 'owner',
        jobsId: [PROJECT_JOB_ID],
      })
      .expect(204);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const teamMembersOnDatabase = await prisma.teamMember.findMany({
      where: {
        projectId: createdProject.id,
      },
    });

    const projectJobsOnDatabase = await prisma.projectJob.findMany({
      where: {
        projectId: createdProject.id,
      },
      include: {
        member: true,
      },
    });

    await waitFor(() => {
      expect(teamMembersOnDatabase).toHaveLength(2);
      expect(teamMembersOnDatabase).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            recipientId: user1.id,
            status: 'approved',
            permissionType: 'owner',
          }),
          expect.objectContaining({
            recipientId: user2.id,
            status: 'approved',
            permissionType: 'owner',
          }),
        ]),
      );
      expect(projectJobsOnDatabase).toHaveLength(1);
      expect(projectJobsOnDatabase[0].member).toHaveLength(1);
    });

    await request(app.getHttpServer())
      .put(
        `/projects/${createdProject.id}/management/member/${user2.id}/privilege-and-job`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        permissionType: 'owner',
        jobsId: [],
      })
      .expect(204);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const hasAssignedMember = await prisma.projectJob.findMany({
      where: {
        projectId: createdProject.id,
      },
      include: {
        member: true,
      },
    });

    expect(hasAssignedMember[0].member).toHaveLength(0);
  });

  test('/projects/interest/in/:projectId (POST) - add interest in a project', async () => {
    const [user1, user2] = await Promise.all([
      userFactory.makeUser(),
      userFactory.makeUser(),
    ]);

    const createdProject = await projectFactory.makeProject({
      authorId: user1.id,
    });

    const accessTokenUser2 = jwt.sign({ uid: user2.id });

    await request(app.getHttpServer())
      .post(`/projects/interest/in/${createdProject.id}`)
      .set('Authorization', `Bearer ${accessTokenUser2}`)
      .expect(204);

    const ProjectOnDatabase = await prisma.project.findUnique({
      where: {
        id: createdProject.id,
      },
      include: {
        interestedInProject: true,
      },
    });

    await waitFor(() => {
      expect(ProjectOnDatabase?.interestedInProject).toHaveLength(1);
      expect(ProjectOnDatabase?.interestedInProject).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: user2.id,
            projectId: createdProject.id,
          }),
        ]),
      );
    });
  });

  test('/projects/:slug/management/details (GET) - get project details for management', async () => {
    const user = await userFactory.makeUser();

    const createdProject = await projectFactory.makeProject({
      authorId: user.id,
    });

    const accessToken = jwt.sign({ uid: user.id });

    const response = await request(app.getHttpServer())
      .get(`/projects/${createdProject.slug.value}/management/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await waitFor(() => {
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(createdProject.id);
      expect(response.body.name).toEqual(createdProject.name);
    });
  });
});
