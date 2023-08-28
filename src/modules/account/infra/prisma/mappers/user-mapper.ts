import { User } from '@modules/account/domain/user';
import { Email } from '@modules/account/domain/value-objects/email';
import { User as RawUser } from '@prisma/client';

export class UserMapper {
  static toDomain(raw: RawUser): User {
    const user = User.create({
      avatarUrl: raw.avatarUrl,
      address: {
        city: raw.city ?? '',
        country: raw.country ?? '',
        state: raw.state ?? '',
      },
      bio: raw.bio ?? '',
      email: Email.create(raw.email).value as Email,
      userName: raw.slug ?? '',
      name: raw.name,
      occupation: raw.occupation ?? '',
      socialMedia: {
        githubLink: raw.githubLink ?? '',
        linkedinLink: raw.linkedinLink ?? '',
      },
    });

    return user;
  }

  static toPersistence(user: User): RawUser {
    return {
      id: user.id,
      avatarUrl: user.avatarUrl,
      slug: user.userName,
      bio: user.bio,
      city: user.address.city,
      country: user.address.country,
      email: user.email.value,
      githubLink: user.socialMedia.githubLink,
      linkedinLink: user.socialMedia.linkedinLink,
      name: user.name,
      occupation: user.occupation,
      state: user.address.state,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? null,
    };
  }
}
