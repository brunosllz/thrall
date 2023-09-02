import { Entity } from '@common/domain/entities/entity';
import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';
import { Optional } from '@common/logic/types/Optional';

interface interestedProps {
  recipientId: string;
  occurredAt: Date;
}

export class Interested extends Entity<interestedProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get occurredAt() {
    return this.props.occurredAt;
  }

  static create(props: Optional<interestedProps, 'occurredAt'>) {
    const resultGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.recipientId, argumentName: 'recipientId' },
    ]);

    if (resultGuard.failed) {
      return Result.fail<Interested>(resultGuard.message);
    }

    const interestedProps = new Interested({
      recipientId: props.recipientId,
      occurredAt: props.occurredAt ?? new Date(),
    });

    return Result.ok<Interested>(interestedProps);
  }
}
