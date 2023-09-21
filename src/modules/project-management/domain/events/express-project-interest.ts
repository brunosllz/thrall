import { DomainEvent } from '@common/domain/events/domain-event';

import { Project } from '../entities/project';

interface ExpressProjectInterestEventProps {
  project: Project;
  recipientId: string;
}

export class ExpressProjectInterestEvent implements DomainEvent {
  public ocurredAt: Date;
  public props: ExpressProjectInterestEventProps;

  constructor(props: ExpressProjectInterestEventProps) {
    this.props = props;
    this.ocurredAt = new Date();
  }

  getAggregateId() {
    return this.props.project.id;
  }
}
