import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { Injectable, Logger } from '@nestjs/common';

import { RejectedInviteTeamMemberEvent } from '../../domain/events/rejected-invite-team-member';
import { RemoveRejectedInviteTeamMemberUseCase } from '../use-cases/commands/remove-rejected-invite-team-member';

@Injectable()
export class OnRejectedInviteTeamMember implements EventHandler {
  constructor(
    private readonly removeRejectedInviteTeamMemberUseCase: RemoveRejectedInviteTeamMemberUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.removeRejectedInvite.bind(this),
      RejectedInviteTeamMemberEvent.name,
    );
  }

  private async removeRejectedInvite({
    props: { memberId, projectId },
  }: RejectedInviteTeamMemberEvent) {
    const result = await this.removeRejectedInviteTeamMemberUseCase.execute({
      projectId,
      recipientId: memberId,
    });

    if (result.isLeft()) {
      Logger.error(result.value.error);
    }
  }
}
