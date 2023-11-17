import { Slug } from '@/common/domain/entities/value-objects/slug';
import { UserSkillList } from '@/modules/account/domain/watched-lists/user-skill-list';
import { UserMapper } from '@/modules/account/infra/prisma/repositories/mappers/user-mapper';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { User, UserProps } from '@modules/account/domain/user';
import { Email } from '@modules/account/domain/value-objects/email';
import { Injectable } from '@nestjs/common';

type Overrides = Partial<UserProps>;

export function makeFakeUser(override = {} as Overrides, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      aboutMe: faker.lorem.paragraph(),
      mainStack: {
        role: faker.person.jobTitle(),
        seniority: faker.person.jobArea(),
      },
      address: {
        city: faker.location.city(),
        country: faker.location.country(),
        state: faker.location.state(),
      },
      avatarUrl: faker.image.avatar(),
      email: Email.create(faker.internet.email()).value as Email,
      title: faker.person.jobTitle(),
      overallRate: 0,
      slugProfile: Slug.createFromText(faker.person.firstName()).getValue(),
      skills: new UserSkillList([
        Skill.create('react').getValue(),
        Skill.create('node').getValue(),
      ]),
      socialMedia: {
        githubLink: faker.internet.url(),
        linkedInLink: faker.internet.url(),
      },
      ...override,
    },
    id,
  ).getValue();

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makeUser(data = {} as Overrides) {
    const user = makeFakeUser(data);

    await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return user;
  }
}
