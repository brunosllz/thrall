import { User } from '@modules/account/domain/user';

import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository extends UsersRepository {
  items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.items.push(user);
  }

  async save(user: User) {
    const userUpdatedIndex = this.items.findIndex(
      (item) => user.id === item.id,
    );

    this.items[userUpdatedIndex] = user;
  }
}
