import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Technology } from '@/modules/account/domain/technology';
import { UserTechnologyList } from '@/modules/account/domain/watched-lists/user-technology-list';
import { PrismaService } from '@common/infra/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { User, UserProps } from '@modules/account/domain/user';
import { Email } from '@modules/account/domain/value-objects/email';
import { UserMapper } from '@modules/account/infra/prisma/mappers/user-mapper';
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
      overallRate: 5,
      slugProfile: Slug.createFromText('bruno luiz').getValue(),
      technologies: new UserTechnologyList([
        Technology.create('react').getValue(),
        Technology.create('node').getValue(),
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
