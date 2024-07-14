import { Slug } from '@/core/domain/value-objects/slug';
import { Entity } from '@/core/domain/entities/entity';
import { Guard } from '@/core/logic/Guard';
import { Result } from '@/core/logic/result';

interface SkillProps {
  slug: Slug;
  createdAt: Date;
}

export class Skill extends Entity<SkillProps> {
  get slug() {
    return this.props.slug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(slug: string, id?: string) {
    const guardResult = Guard.againstNullOrUndefined(slug, 'slug');

    if (guardResult.failed) {
      return Result.fail<Skill>(guardResult.message);
    }

    const newSlug = Slug.createFromText(slug);

    if (newSlug.isFailure) {
      return Result.fail<Skill>(newSlug.error);
    }

    const skill = new Skill(
      {
        slug: newSlug.getValue(),
        createdAt: new Date(),
      },
      id,
    );

    return Result.ok<Skill>(skill);
  }
}
