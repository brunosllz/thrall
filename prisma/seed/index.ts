import { Slug } from '@/core/domain/value-objects/slug';
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
  { name: 'Desenvolvedor Front-end', slug: 'desenvolvedor-front-end' },
  { name: 'Desenvolvedor Back-end', slug: 'desenvolvedor-back-end' },
  { name: 'Engenheiro de Software', slug: 'engenheiro-de-software' },
  { name: 'Arquiteto de Software', slug: 'arquiteto-de-software' },
  { name: 'Analista de Sistemas', slug: 'analista-de-sistemas' },
  {
    name: 'Analista de Qualidade de Software',
    slug: 'analista-de-qualidade-de-software',
  },
  {
    name: 'Gerente de Projeto de Software',
    slug: 'gerente-de-projeto-de-software',
  },
  { name: 'Scrum Master', slug: 'scrum-master' },
  { name: 'Product Owner', slug: 'product-owner' },
  { name: 'UX/UI Designer', slug: 'ux-ui-designer' },
  { name: 'Engenheiro de DevOps', slug: 'engenheiro-de-devops' },
  { name: 'Engenheiro de Testes', slug: 'engenheiro-de-testes' },
  { name: 'Desenvolvedor Full Stack', slug: 'desenvolvedor-full-stack' },
  { name: 'Desenvolvedor Mobile', slug: 'desenvolvedor-mobile' },
  { name: 'Engenheiro de Dados', slug: 'engenheiro-de-dados' },
  {
    name: 'Analista de Segurança da Informação',
    slug: 'analista-de-seguranca-da-informacao',
  },
  { name: 'Analista de Dados', slug: 'analista-de-dados' },
  { name: 'Engenheiro de Redes', slug: 'engenheiro-de-redes' },
  {
    name: 'Administrador de Banco de Dados',
    slug: 'administrador-de-banco-de-dados',
  },
  { name: 'Engenheiro de Integração', slug: 'engenheiro-de-integracao' },
  { name: 'Engenheiro de Cloud', slug: 'engenheiro-de-cloud' },
  { name: 'Analista de Requisitos', slug: 'analista-de-requisitos' },
  { name: 'Analista de Negócios', slug: 'analista-de-negocios' },
  { name: 'Desenvolvedor Java', slug: 'desenvolvedor-java' },
  { name: 'Desenvolvedor Python', slug: 'desenvolvedor-python' },
  { name: 'Desenvolvedor JavaScript', slug: 'desenvolvedor-javascript' },
  { name: 'Desenvolvedor PHP', slug: 'desenvolvedor-php' },
  { name: 'Desenvolvedor C#', slug: 'desenvolvedor-c' },
  { name: 'Desenvolvedor Ruby', slug: 'desenvolvedor-ruby' },
  { name: 'Desenvolvedor Swift', slug: 'desenvolvedor-swift' },
  { name: 'Desenvolvedor Kotlin', slug: 'desenvolvedor-kotlin' },
  { name: 'Desenvolvedor TypeScript', slug: 'desenvolvedor-typescript' },
  { name: 'Desenvolvedor C++', slug: 'desenvolvedor-cpp' },
  { name: 'Desenvolvedor Go', slug: 'desenvolvedor-go' },
  { name: 'Desenvolvedor Rust', slug: 'desenvolvedor-rust' },
  { name: 'Desenvolvedor Scala', slug: 'desenvolvedor-scala' },
  { name: 'Desenvolvedor Lua', slug: 'desenvolvedor-lua' },
  { name: 'Desenvolvedor HTML/CSS', slug: 'desenvolvedor-html-css' },
  { name: 'Desenvolvedor Android', slug: 'desenvolvedor-android' },
  { name: 'Desenvolvedor iOS', slug: 'desenvolvedor-ios' },
  {
    name: 'Engenheiro de Machine Learning',
    slug: 'engenheiro-de-machine-learning',
  },
  {
    name: 'Engenheiro de Inteligência Artificial',
    slug: 'engenheiro-de-inteligencia-artificial',
  },
  { name: 'Analista de Big Data', slug: 'analista-de-big-data' },
  { name: 'Desenvolvedor Web', slug: 'desenvolvedor-web' },
  { name: 'Engenheiro de Front-end', slug: 'engenheiro-de-front-end' },
  { name: 'Engenheiro de Back-end', slug: 'engenheiro-de-back-end' },
  {
    name: 'Engenheiro de Segurança de Software',
    slug: 'engenheiro-de-seguranca-de-software',
  },
];

async function main() {
  await prisma.skill.deleteMany();
  await prisma.interestedInProject.deleteMany();
  await prisma.projectJob.deleteMany();
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

  await prisma.role.createMany({
    data: roles,
  });

  await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      projectName = faker.company.name();

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
          projectJobs: {
            create: {
              description: `
                ${faker.lorem.paragraphs()}
                ${faker.lorem.paragraphs()}
              `,
              membersAmount: faker.number.int({ max: 5, min: 0 }),
              role: {
                connectOrCreate: {
                  where: {
                    slug: 'devops',
                  },
                  create: {
                    name: 'devops',
                    slug: 'devops',
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
          roleSlug: roles[randomIndex].slug,
        }),
      );

      await prisma.projectJob.createMany({
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
