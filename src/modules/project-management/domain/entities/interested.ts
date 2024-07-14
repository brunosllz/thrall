import { Entity } from '@/core/domain/entities/entity';
import { Guard } from '@/core/logic/Guard';
import { Result } from '@/core/logic/result';
import { Optional } from '@/core/logic/types/Optional';

export enum InterestedStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

interface interestedProps {
  recipientId: string;
  occurredAt: Date;
  status: InterestedStatus;
  updatedAt?: Date;
}

export class Interested extends Entity<interestedProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get occurredAt() {
    return this.props.occurredAt;
  }

  get status() {
    return this.props.status;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set status(status: InterestedStatus) {
    this.props.status = status;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<interestedProps, 'occurredAt' | 'status'>,
    id?: string,
  ) {
    const resultGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.recipientId, argumentName: 'recipientId' },
    ]);

    if (resultGuard.failed) {
      return Result.fail<Interested>(resultGuard.message);
    }

    const interestedProps = new Interested(
      {
        recipientId: props.recipientId,
        occurredAt: props.occurredAt ?? new Date(),
        status: props.status ?? InterestedStatus.PENDING,
      },
      id,
    );

    return Result.ok<Interested>(interestedProps);
  }
}
