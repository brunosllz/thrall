import { InMemoryPostRepository } from '../repositories/in-memory/in-memory-post-repository';
import { CreatePostUseCase } from './create-post';

let sut: CreatePostUseCase;
let postRepository: InMemoryPostRepository;

describe('Create a post', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new CreatePostUseCase(postRepository);
  });

  it('should be able create a post', async () => {
    await sut.execute({
      content: 'a'.repeat(1000),
      roles: 'develop',
      title: 'title example',
    });

    expect(postRepository.items).toHaveLength(1);
    expect(postRepository.items[0].slug.value).toEqual('title-example');
  });
});
