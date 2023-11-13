import { Slug } from '@/common/domain/entities/value-objects/slug';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const skills = [
  { slug: 'react' },
  { slug: 'node' },
  { slug: 'typescript' },
  { slug: 'javascript' },
  { slug: 'nextjs' },
  { slug: 'nestjs' },
  { slug: 'react-native' },
  { slug: 'mongodb' },
  { slug: 'mysql' },
  { slug: 'vue' },
  { slug: 'angular' },
  { slug: 'expressjs' },
  { slug: 'python' },
  { slug: 'django' },
  { slug: 'flask' },
  { slug: 'docker' },
  { slug: 'kubernetes' },
  { slug: 'jenkins' },
  { slug: 'git' },
  { slug: 'github' },
  { slug: 'aws' },
  { slug: 'azure' },
  { slug: 'google-cloud' },
  { slug: 'graphql' },
  { slug: 'rest-api' },
  { slug: 'serverless' },
  { slug: 'redux' },
  { slug: 'mobx' },
  { slug: 'webpack' },
  { slug: 'babel' },
  { slug: 'sass' },
  { slug: 'less' },
  { slug: 'styled-components' },
  { slug: 'tailwindcss' },
  { slug: 'storybook' },
  { slug: 'jest' },
  { slug: 'mocha' },
  { slug: 'chai' },
  { slug: 'cypress' },
  { slug: 'enzyme' },
  { slug: 'npm' },
  { slug: 'yarn' },
  { slug: 'eslint' },
  { slug: 'prettier' },
  { slug: 'vscode' },
  { slug: 'sublime-text' },
  { slug: 'vim' },
  { slug: 'intellij-idea' },
  { slug: 'eclipse' },
  { slug: 'android' },
  { slug: 'ios' },
  { slug: 'flutter' },
  { slug: 'ionic' },
  { slug: 'xamarin' },
  { slug: 'docker-compose' },
  { slug: 'nginx' },
  { slug: 'apache' },
  { slug: 'linux' },
  { slug: 'ubuntu' },
  { slug: 'centos' },
  { slug: 'debian' },
  { slug: 'ansible' },
  { slug: 'terraform' },
  { slug: 'puppet' },
  { slug: 'chef' },
  { slug: 'splunk' },
  { slug: 'elk-stack' },
  { slug: 'grafana' },
  { slug: 'prometheus' },
  { slug: 'kibana' },
  { slug: 'travis-ci' },
  { slug: 'circle-ci' },
  { slug: 'gitlab-ci' },
  { slug: 'jira' },
  { slug: 'confluence' },
  { slug: 'trello' },
  { slug: 'asana' },
  { slug: 'slack' },
  { slug: 'microsoft-teams' },
  { slug: 'zoom' },
  { slug: 'google-meet' },
  { slug: 'microsoft-meetings' },
  { slug: 'jitsi' },
  { slug: 'webex' },
];

const roles = [
  { name: 'Desenvolvedor Front-end' },
  { name: 'Desenvolvedor Back-end' },
  { name: 'Engenheiro de Software' },
  { name: 'Arquiteto de Software' },
  { name: 'Analista de Sistemas' },
  { name: 'Analista de Qualidade de Software' },
  { name: 'Gerente de Projeto de Software' },
  { name: 'Scrum Master' },
  { name: 'Product Owner' },
  { name: 'UX/UI Designer' },
  { name: 'Engenheiro de DevOps' },
  { name: 'Engenheiro de Testes' },
  { name: 'Desenvolvedor Full Stack' },
  { name: 'Desenvolvedor Mobile' },
  { name: 'Engenheiro de Dados' },
  { name: 'Analista de Segurança da Informação' },
  { name: 'Analista de Dados' },
  { name: 'Engenheiro de Redes' },
  { name: 'Administrador de Banco de Dados' },
  { name: 'Engenheiro de Integração' },
  { name: 'Engenheiro de Cloud' },
  { name: 'Analista de Requisitos' },
  { name: 'Analista de Negócios' },
  { name: 'Desenvolvedor Java' },
  { name: 'Desenvolvedor Python' },
  { name: 'Desenvolvedor JavaScript' },
  { name: 'Desenvolvedor PHP' },
  { name: 'Desenvolvedor C#' },
  { name: 'Desenvolvedor Ruby' },
  { name: 'Desenvolvedor Swift' },
  { name: 'Desenvolvedor Kotlin' },
  { name: 'Desenvolvedor TypeScript' },
  { name: 'Desenvolvedor C++' },
  { name: 'Desenvolvedor Go' },
  { name: 'Desenvolvedor Rust' },
  { name: 'Desenvolvedor Scala' },
  { name: 'Desenvolvedor Lua' },
  { name: 'Desenvolvedor HTML/CSS' },
  { name: 'Desenvolvedor Android' },
  { name: 'Desenvolvedor iOS' },
  { name: 'Engenheiro de Machine Learning' },
  { name: 'Engenheiro de Inteligência Artificial' },
  { name: 'Analista de Big Data' },
  { name: 'Desenvolvedor Web' },
  { name: 'Engenheiro de Front-end' },
  { name: 'Engenheiro de Back-end' },
  { name: 'Engenheiro de Segurança de Software' },
];

async function main() {
  await prisma.skill.deleteMany();
  await prisma.interestedInProject.deleteMany();
  await prisma.projectRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  await prisma.skill.createMany({
    data: skills,
  });

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
        connect: [
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

  await prisma.role.createMany({
    data: roles,
  });

  await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      projectName = faker.company.name();
      roleName = faker.person.jobTitle();

      const project = await prisma.project.create({
        data: {
          name: projectName,
          availableTimeUnit: 'hour',
          availableTimeValue: Math.floor(Math.random() * 10),
          description: `
            ${faker.lorem.paragraphs()}
            ${faker.lorem.paragraphs()}
          `,
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
              description: `
                ${faker.lorem.paragraphs()}
                ${faker.lorem.paragraphs()}
              `,
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
          createdAt: faker.date.between({
            from: dayjs().subtract(6, 'week').toISOString(),
            to: dayjs().toDate().toISOString(),
          }),
        },
      });

      const randomSkills = skills
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * skills.length) + 1);

      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          skills: {
            connect: randomSkills,
          },
        },
      });

      const roles = await prisma.role.findMany();
      const randomIndex = Math.floor(Math.random() * roles.length * 0.6);

      const numberOfProjectRoles = Math.floor(Math.random() * 3) + 1;

      const projectRoles = Array.from({ length: numberOfProjectRoles }).map(
        () => ({
          projectId: project.id,
          description: `
            ${faker.lorem.paragraphs()}
            ${faker.lorem.paragraphs()}
          `,
          membersAmount: faker.number.int({ max: 5, min: 0 }),
          roleId: roles[randomIndex].id,
        }),
      );

      await prisma.projectRole.createMany({
        data: projectRoles,
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
