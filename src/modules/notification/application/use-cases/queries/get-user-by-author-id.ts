import { Either, left, right } from '@/common/logic/either';
import { Result } from '@/common/logic/result';
import { Injectable } from '@nestjs/common';

import { NotificationsDAO } from '../../dao/notifications-dao';

interface GetUserByAuthorIdUseCaseRequest {
  authorId: string;
}

type GetUserByAuthorIdUseCaseResponse = Either<Result<void>, Result<any>>;

@Injectable()
export class GetUserByAuthorIdUseCase {
  constructor(private readonly notificationsDAO: NotificationsDAO) {}

  async execute({
    authorId,
  }: GetUserByAuthorIdUseCaseRequest): Promise<GetUserByAuthorIdUseCaseResponse> {
    try {
      const author = await this.notificationsDAO.findUserByAuthorId(authorId);

      return right(Result.ok(author));
    } catch (error) {
      return left(Result.fail(error));
    }
  }
}
