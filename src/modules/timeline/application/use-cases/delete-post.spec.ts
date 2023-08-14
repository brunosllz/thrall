import { Post } from '@modules/timeline/domain/entities/post';

import { InMemoryPostRepository } from '../repositories/in-memory/in-memory-post-repository';
import { DeletePostUseCase } from './delete-post';

let sut: DeletePostUseCase;
let postRepository: InMemoryPostRepository;

describe('Delete a post', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new DeletePostUseCase(postRepository);
  });

  it('should be able delete a post', async () => {
    const post = Post.create({
      title: 'title example',
      content: 'content example',
      roles: 'role example',
    });

    await postRepository.create(post);

    await sut.execute({ id: post.id });

    expect(postRepository.items).toHaveLength(0);
  });
});
