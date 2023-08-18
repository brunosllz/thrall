import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { ProjectsRepository } from '@modules/timeline/application/repositories/projects-repository';
import { AnswerCreatedEvent } from '@modules/timeline/domain/events/answer-created';

import { SendNotificationUseCase } from '../application/use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private projectsRepository: ProjectsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const project = await this.projectsRepository.findById(answer.projectId);

    if (project) {
      await this.sendNotification.execute({
        recipientId: project.authorId,
        title: `Nova resposta em "${project.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      });
    }
  }
}
