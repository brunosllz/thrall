import { User } from '@/modules/account/domain/user';
import { Prisma, User as RawUser } from '@prisma/client';

export class UserMapper {
  static toPersistence(user: User): RawUser {
    return {
      aboutMe: user.aboutMe,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      email: user.email.value,
      id: user.id,
      role: user.mainStack.role,
      seniority: user.mainStack.seniority,
      city: user.address.city,
      country: user.address.country,
      state: user.address.state,
      githubLink: user.socialMedia.githubLink,
      overallRate: user.overallRate as unknown as Prisma.Decimal,
      slugProfile: user.slugProfile.value,
      linkedinLink: user.socialMedia.linkedInLink,
      profileUrl: null,
      title: user.title,
      onboard: null,
      updatedAt: user.updatedAt ?? null,
      name: user.name,
    };
  }
}
