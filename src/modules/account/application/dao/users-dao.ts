import { AsyncMaybe } from '@common/logic/types/Maybe';

export abstract class UsersDAO {
  abstract findById(userId: string): AsyncMaybe<any>;
}
