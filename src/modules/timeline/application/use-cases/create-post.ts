import { Injectable } from '@nestjs/common';

import { Post } from '../../domain/entities/post';
import { PostRepository } from '../repositories/post-repository';

interface CreatePostRequest {
  content: string;
  title: string;
  roles: string;
}

type CreatePostResponse = Promise<void>;

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute({
    content,
    title,
    roles,
  }: CreatePostRequest): CreatePostResponse {
    const post = Post.create({ content, title, roles });

    await this.postRepository.create(post);
  }
}
