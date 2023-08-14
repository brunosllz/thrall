import { Injectable } from '@nestjs/common';

import { PostRepository } from '../repositories/post-repository';

interface DeletePostRequest {
  id: string;
}

type DeletePostResponse = Promise<void>;

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ id }: DeletePostRequest): DeletePostResponse {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('resources not found.');
    }

    await this.postRepository.delete(id);
  }
}
