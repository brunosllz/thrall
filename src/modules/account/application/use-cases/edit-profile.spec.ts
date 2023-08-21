import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';

import { makeFakeUser } from '@test/factories/make-user';

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { EditProfileUseCase } from './edit-profile';

let usersRepository: InMemoryUsersRepository;
let sut: EditProfileUseCase;

describe('Edit user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new EditProfileUseCase(usersRepository);
  });

  it('should be able to edit a user profile', async () => {
    const user = makeFakeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      address: user.address,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      occupation: 'Full stack',
      socialMedia: user.socialMedia,
      userId: user.id,
    });
    expect(result.isRight()).toBeTruthy();
    expect(usersRepository.items).toHaveLength(1);
    expect(usersRepository.items[0].occupation).toBe('Full stack');
  });

  it('should be not able edit user profile with non exist id', async () => {
    const user = makeFakeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      address: user.address,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      occupation: 'Full stack',
      socialMedia: user.socialMedia,
      userId: 'non-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
