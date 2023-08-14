import { Post } from '../../domain/entities/post';

export abstract class PostRepository {
  abstract create(post: Post): Promise<void>;
  abstract save(post: Post): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Post | null>;
}
