import { Post } from '@modules/timeline/domain/entities/post';

import { InMemoryPostRepository } from '../repositories/in-memory/in-memory-post-repository';
import { EditPostUseCase } from './edit-post';

let sut: EditPostUseCase;
let postRepository: InMemoryPostRepository;

describe('Edit a post', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new EditPostUseCase(postRepository);
  });

  it('should be able edit a post', async () => {
    const post = Post.create({
      title: 'title example',
      content: 'content example',
      roles: 'role example',
    });

    await postRepository.create(post);

    await sut.execute({
      id: post.id,
      content: 'content example 2',
      roles: 'developer',
    });

    expect(postRepository.items[0].content).toEqual('content example 2');
    expect(postRepository.items[0].roles).toEqual('developer');
  });

  it('should be not able edit a post with non exists id', async () => {
    await expect(
      sut.execute({
        id: 'non-id',
        content: 'content example 2',
        roles: 'developer',
      }),
    ).rejects.toThrow();
  });
});
