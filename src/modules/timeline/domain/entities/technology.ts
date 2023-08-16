import { Entity } from '@common/domain/entity';

import { Slug } from './value-objects/slug';

//TODO: maybe need put a label for slug here

interface TechnologyProps {
  slug: Slug;
  createdAt: Date;
}

export class Technology extends Entity<TechnologyProps> {
  get slug() {
    return this.props.slug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(slug: string, id?: string) {
    const technology = new Technology(
      {
        slug: Slug.createFromText(slug),
        createdAt: new Date(),
      },
      id,
    );

    return technology;
  }
}
