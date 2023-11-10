import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Guard } from '@/common/logic/Guard';
import { Result } from '@/common/logic/result';
import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

import { Email } from './value-objects/email';
import { UserSkillList } from './watched-lists/user-skill-list';

export interface UserProps {
  name: string;
  email: Email;
  title: string;
  aboutMe: string;
  avatarUrl: string;
  slugProfile: Slug;
  address: {
    city: string;
    state: string;
    country: string;
  };
  socialMedia: {
    linkedInLink: string;
    githubLink: string;
  };
  mainStack: {
    role: string;
    seniority: string;
  };
  overallRate: number;
  skills: UserSkillList;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get title() {
    return this.props.title;
  }

  get aboutMe() {
    return this.props.aboutMe;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get slugProfile() {
    return this.props.slugProfile;
  }

  get address() {
    return this.props.address;
  }

  get socialMedia() {
    return this.props.socialMedia;
  }

  get mainStack() {
    return this.props.mainStack;
  }

  get overallRate() {
    return this.props.overallRate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'skills'>,
    id?: string,
  ) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (guardResult.failed) {
      return Result.fail<User>(guardResult.message);
    }

    const user = new User(
      {
        ...props,
        skills: props.skills ?? new UserSkillList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return Result.ok<User>(user);
  }
}
