import { Slug } from '@/common/domain/entities/value-objects/slug';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const userFullName = faker.person.fullName();

  const user = await prisma.user.create({
    data: {
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      name: userFullName,
      email: faker.internet.email(),
      slugProfile: new Slug(userFullName).value,
      role: 'Dev Fullstack',
      aboutMe: faker.lorem.paragraph(),
      onboard: new Date(),
      seniority: 'Senior',
      state: 'São Paulo',
      city: 'São Paulo',
      country: 'Brasil',
      overallRate: 4.5,
      title: 'Dev Fullstack | React | Node',
      githubLink: faker.internet.url(),
      linkedinLink: faker.internet.url(),
      skills: {
        create: [
          {
            slug: 'react',
          },
          {
            slug: 'node',
          },
          {
            slug: 'typescript',
          },
          {
            slug: 'javascript',
          },
          {
            slug: 'nextjs',
          },
          {
            slug: 'nestjs',
          },
          {
            slug: 'react-native',
          },
          {
            slug: 'mongodb',
          },
          {
            slug: 'mysql',
          },
        ],
      },
    },
  });

  let projectName;
  let roleName;

  await Promise.all(
    Array.from({ length: 40 }).map(async () => {
      projectName = faker.company.name();
      roleName = faker.person.jobTitle();

      await prisma.project.create({
        data: {
          name: projectName,
          availableTimeUnit: 'hour',
          availableTimeValue: Math.floor(Math.random() * 10),
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.avatarGitHub(),
          slug: new Slug(projectName).value,
          authorId: user.id,
          availableDays: [
            faker.number.int({ max: 6, min: 0 }),
            faker.number.int({ max: 6, min: 0 }),
            faker.number.int({ max: 6, min: 0 }),
          ],
          teamMembers: {
            create: {
              recipientId: user.id,
              permissionType: 'owner',
              status: 'approved',
            },
          },
          projectRoles: {
            create: {
              description: faker.lorem.paragraph(),
              membersAmount: faker.number.int({ max: 5, min: 0 }),
              role: {
                connectOrCreate: {
                  create: {
                    name: roleName,
                  },
                  where: {
                    name: roleName,
                  },
                },
              },
            },
          },
          status: 'recruiting',
          skills: {
            connectOrCreate: {
              create: {
                slug: 'react',
              },
              where: {
                slug: 'react',
              },
            },
          },
          createdAt: faker.date.between({
            from: dayjs().subtract(6, 'week').toISOString(),
            to: dayjs().toDate().toISOString(),
          }),
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);

    await prisma.$disconnect();
    process.exit(1);
  });
