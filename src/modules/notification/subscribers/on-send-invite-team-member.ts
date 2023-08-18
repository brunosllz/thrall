import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { ProjectsRepository } from '@modules/timeline/application/repositories/projects-repository';
import { SendInviteTeamMemberEvent } from '@modules/timeline/domain/events/send-invite-team-member';

import { SendNotificationUseCase } from '../application/use-cases/send-notification';

export class OnSendInviteTeamMember implements EventHandler {
  constructor(
    private projectsRepository: ProjectsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewInviteTeamMemberNotification.bind(this),
      SendInviteTeamMemberEvent.name,
    );
  }

  //TODO: get name of user then send the notification -> john doe send you a invite to participate of project
  private async sendNewInviteTeamMemberNotification({
    props,
  }: SendInviteTeamMemberEvent) {
    const project = await this.projectsRepository.findById(props.project.id);

    if (project) {
      await this.sendNotification.execute({
        recipientId: props.recipientId,
        title: `Novo convite para participar do projeto "${project.title}`,
        content: 'Venha fazer parte do time!',
      });
    }
  }
}
