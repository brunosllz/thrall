import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../repositories/users-repository';

interface EditProfileRequest {
  userId: string;
  occupation: string;
  avatarUrl: string;
  bio: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  socialMedia: {
    linkedinLink: string;
    githubLink: string;
  };
}

type EditProfileResponse = Either<ResourceNotFoundError, Record<string, never>>;

@Injectable()
export class EditProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
    address,
    avatarUrl,
    bio,
    occupation,
    socialMedia,
  }: EditProfileRequest): Promise<EditProfileResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.address = address;
    user.avatarUrl = avatarUrl;
    user.bio = bio;
    user.occupation = occupation;
    user.socialMedia = socialMedia;

    await this.usersRepository.save(user);

    return right({});
  }
}
