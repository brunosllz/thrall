import { Post } from '@modules/timeline/domain/entities/post';

import { PostRepository } from '../post-repository';

export class InMemoryPostRepository implements PostRepository {
  items: Post[] = [];

  async create(post: Post) {
    this.items.push(post);
  }

  async save(post: Post) {
    const postUpdatedIndex = this.items.findIndex(
      (item) => post.id === item.id,
    );

    this.items[postUpdatedIndex] = post;
  }

  async delete(id: string) {
    const newItems = this.items.filter((post) => post.id !== id);

    this.items = newItems;
  }

  async findById(id: string) {
    const post = this.items.find((post) => post.id === id);

    if (!post) {
      return null;
    }

    return post;
  }
}
