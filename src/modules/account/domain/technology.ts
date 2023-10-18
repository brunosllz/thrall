import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Entity } from '@common/domain/entities/entity';
import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';

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
    const guardResult = Guard.againstNullOrUndefined(slug, 'slug');

    if (guardResult.failed) {
      return Result.fail<Technology>(guardResult.message);
    }

    const newSlug = Slug.createFromText(slug);

    if (newSlug.isFailure) {
      return Result.fail<Technology>(newSlug.error);
    }

    const technology = new Technology(
      {
        slug: newSlug.getValue(),
        createdAt: new Date(),
      },
      id,
    );

    return Result.ok<Technology>(technology);
  }
}
