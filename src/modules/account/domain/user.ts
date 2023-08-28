import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

import { Email } from './value-objects/email';

export interface UserProps {
  name: string;
  userName: string;
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
  get name() {
    return this.props.name;
  }

  get userName() {
    return this.props.userName;
  }

  get email() {
    return this.props.email;
  }

  get bio() {
    return this.props.bio;
  }

  get occupation() {
    return this.props.occupation;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get address() {
    return this.props.address;
  }

  get socialMedia() {
    return this.props.socialMedia;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set bio(bio: string) {
    this.props.bio = bio;
  }

  set occupation(occupation: string) {
    this.props.occupation = occupation;
  }

  set avatarUrl(avatarUrl: string) {
    this.props.avatarUrl = avatarUrl;
  }

  set address(address: UserProps['address']) {
    this.props.address = address;
  }

  set socialMedia(socialMedia: UserProps['socialMedia']) {
    this.props.socialMedia = socialMedia;
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string) {
    return new User({ ...props, createdAt: props.createdAt ?? new Date() }, id);
  }
}
