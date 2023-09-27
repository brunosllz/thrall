import { DomainEvent } from '@common/domain/events/domain-event';

interface SendInviteTeamMemberEventProps {
  projectId: string;
  memberId: string;
}

export class RejectedInviteTeamMemberEvent implements DomainEvent {
  public props: SendInviteTeamMemberEventProps;
  public occurredAt: Date;

  constructor(props: SendInviteTeamMemberEventProps) {
    this.props = props;
    this.occurredAt = new Date();
  }

  getAggregateId() {
    return this.props.projectId;
  }
}
