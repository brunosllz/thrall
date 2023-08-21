import { Optional } from '@common/logic/types/Optional';

interface interestedProps {
  recipientId: string;
  occurredAt: Date;
}

export class Interested {
  constructor(private readonly props: interestedProps) {}

  get recipientId() {
    return this.props.recipientId;
  }

  get occurredAt() {
    return this.props.occurredAt;
  }

  static create(props: Optional<interestedProps, 'occurredAt'>) {
    const interestedProps = new Interested({
      recipientId: props.recipientId,
      occurredAt: props.occurredAt ?? new Date(),
    });

    return interestedProps;
  }
}
