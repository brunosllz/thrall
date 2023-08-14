import { Injectable } from '@nestjs/common';

import { PostRepository } from '../repositories/post-repository';

interface EditPostRequest {
  id: string;
  content?: string;
  title?: string;
  roles?: string;
}

type EditPostResponse = Promise<void>;

@Injectable()
export class EditPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute({
    id,
    content,
    roles,
    title,
  }: EditPostRequest): EditPostResponse {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('resources not found.');
    }

    post.content = content ?? post.content;
    post.title = title ?? post.title;
    post.roles = roles ?? post.roles;

    await this.postRepository.save(post);
  }
}
