import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { UsersDAO } from '../users-dao';

export class InMemoryUsersDAO extends UsersDAO {
  constructor(readonly inMemoryUsersRepository: InMemoryUsersRepository) {
    super();
  }

  async findById(id: string) {
    const user = this.inMemoryUsersRepository.items.find(
      (user) => user.id === id,
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
