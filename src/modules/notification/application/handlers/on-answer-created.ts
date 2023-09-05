import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { AnswerCreatedEvent } from '@modules/project-management/domain/events/answer-created';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { SendNotificationJob } from '../jobs/send-notification-job';

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private projectsRepository: ProjectsRepository,
    @InjectQueue('notifications') private notificationQueue: Queue,
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
      await this.notificationQueue.add(
        'answer-created',
        new SendNotificationJob({
          authorId: answer.authorId,
          recipientId: project.authorId,
          title: `Nova resposta em ${project.name}`,
          content: answer.excerpt,
        }),
      );
    }
  }
}
