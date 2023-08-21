import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

import { Email } from './value-objects/email';

interface UserProps {
  name: string;
  email: Email;
  bio: string;
  occupation: string;
  avatarUrl: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  socialMedia: {
    linkedinLink: string;
    githubLink: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  isLeft(): any {
    throw new Error('Method not implemented.');
  }
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get bio() {
    return this.props.bio;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<UserProps, 'createdAt'>) {
    return new User({ ...props, createdAt: props.createdAt ?? new Date() });
  }
}
