import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { SendInviteTeamMemberEvent } from '@modules/project-management/domain/events/send-invite-team-member';

import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnSentInviteTeamMember implements EventHandler {
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
        authorId: props.senderId,
        recipientId: props.recipientId,
        title: `Novo convite para participar do projeto "${project.name}`,
        content: 'Venha fazer parte do time!',
      });
    }
  }
}
