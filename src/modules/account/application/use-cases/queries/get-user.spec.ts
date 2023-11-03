import { makeFakeUser } from '@test/factories/make-user';

import { InMemoryUsersDAO } from '../../dao/in-memory/in-memory-users-dao';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { GetUserUseCase } from './get-user';

let usersRepository: InMemoryUsersRepository;
let usersDAO: InMemoryUsersDAO;
let sut: GetUserUseCase;

describe('Get user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    usersDAO = new InMemoryUsersDAO(usersRepository);

    sut = new GetUserUseCase(usersDAO);
  });

  it('should be able to get an user by id', async () => {
    const user = makeFakeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toMatchObject({
      _value: expect.objectContaining({
        id: user.id,
        name: user.name,
      }),
    });
  });
});
