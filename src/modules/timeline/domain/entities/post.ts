import { Entity } from '@common/domain/entity';
import { Replace } from '@common/logic/Replace';

import { Slug } from './value-objects/slug';
import { Summary } from './value-objects/summary';

interface PostProps {
  title: string;
  content: string;
  summary: Summary;
  slug: Slug;
  roles: string;
  created_at: Date;
  updated_at: Date | null;
}

export class Post extends Entity<PostProps> {
  set title(text: string) {
    this.props.title = text;
    this.update();
  }

  get title() {
    return this.props.title;
  }

  set content(content: string) {
    this.props.content = content;
    this.update();
  }

  get content() {
    return this.props.content;
  }

  get summary() {
    return this.props.summary;
  }

  get slug() {
    return this.props.slug;
  }

  set roles(text: string) {
    this.props.roles = text;
    this.update();
  }

  get roles() {
    return this.props.roles;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  private update() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Replace<
      Omit<PostProps, 'slug' | 'summary'>,
      { created_at?: Date; updated_at?: Date }
    >,
    id?: string,
  ) {
    const post = new Post(
      {
        ...props,
        slug: Slug.createFromText(props.title),
        summary: Summary.create(props.content),
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? null,
      },
      id,
    );

    return post;
  }
}
