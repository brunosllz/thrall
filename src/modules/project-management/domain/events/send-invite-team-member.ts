import { DomainEvent } from '@common/domain/events/domain-event';

import { Project } from '../entities/project';

interface SendInviteTeamMemberEventProps {
  project: Project;
  recipientId: string;
  senderId: string;
}

export class SendInviteTeamMemberEvent implements DomainEvent {
  public props: SendInviteTeamMemberEventProps;
  public occurredAt: Date;

  constructor(props: SendInviteTeamMemberEventProps) {
    this.props = props;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.props.project.id;
  }
}
