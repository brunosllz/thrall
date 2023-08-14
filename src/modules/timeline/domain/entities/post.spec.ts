import { Post } from './post';

describe('Post', () => {
  it('should be able to create a post', () => {
    const post = Post.create({
      title: 'title example',
      content: 'content example',
      roles: 'role example',
    });

    expect(post.id).toEqual(expect.any(String));
    expect(post.title).toEqual('title example');
  });
});
