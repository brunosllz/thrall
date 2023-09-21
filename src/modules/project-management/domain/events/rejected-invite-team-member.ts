import { DomainEvent } from '@common/domain/events/domain-event';

interface SendInviteTeamMemberEventProps {
  projectId: string;
  memberId: string;
}

export class RejectedInviteTeamMemberEvent implements DomainEvent {
  public props: SendInviteTeamMemberEventProps;
  public ocurredAt: Date;

  constructor(props: SendInviteTeamMemberEventProps) {
    this.props = props;
    this.ocurredAt = new Date();
  }

  getAggregateId() {
    return this.props.projectId;
  }
}
