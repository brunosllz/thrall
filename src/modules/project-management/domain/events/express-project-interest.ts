import { DomainEvent } from '@common/domain/events/domain-event';

import { Project } from '../entities/project';

interface ExpressProjectInterestEventProps {
  project: Project;
  recipientId: string;
}

export class ExpressProjectInterestEvent implements DomainEvent {
  public occurredAt: Date;
  public props: ExpressProjectInterestEventProps;

  constructor(props: ExpressProjectInterestEventProps) {
    this.props = props;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.props.project.id;
  }
}
