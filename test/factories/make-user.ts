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
      userName: faker.internet.userName(),
      address: {
        city: faker.location.city(),
        country: faker.location.country(),
        state: faker.location.state(),
      },
      avatarUrl: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      email: Email.create(faker.internet.email()).value as Email,
      occupation: faker.person.jobTitle(),
      socialMedia: {
        githubLink: faker.internet.url(),
        linkedinLink: faker.internet.url(),
      },
      ...override,
    },
    id,
  );

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
