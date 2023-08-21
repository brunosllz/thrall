import { AsyncMaybe } from '@common/logic/types/Maybe';
import { User } from '@modules/account/domain/user';

export abstract class UsersRepository {
  abstract findById(id: string): AsyncMaybe<User>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
