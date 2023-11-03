import { Result } from '@/common/logic/result';
import { ResourceNotFoundError } from '@common/errors/errors/resource-not-found-error';
import { Either, left, right } from '@common/logic/either';
import { Injectable, Logger } from '@nestjs/common';

import { UsersDAO } from '../../dao/users-dao';

interface GetUserRequest {
  userId: string;
}

type GetUserResponse = Either<ResourceNotFoundError, Result<any>>;

@Injectable()
export class GetUserUseCase {
  constructor(private readonly usersDAO: UsersDAO) {}

  async execute({ userId }: GetUserRequest): Promise<GetUserResponse> {
    try {
      Logger.error(userId);

      const user = await this.usersDAO.findById(userId);

      Logger.error(user);

      if (!user) {
        return left(new ResourceNotFoundError());
      }

      return right(Result.ok(user));
    } catch (error) {
      return left(error);
    }
  }
}
