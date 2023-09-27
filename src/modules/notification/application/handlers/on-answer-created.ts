import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { ProjectsRepository } from '@modules/project-management/application/repositories/projects-repository';
import { AnswerCreatedEvent } from '@modules/project-management/domain/events/answer-created';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { NotificationType } from '../../domain/entities/notification';
import { SendNotificationJob } from '../queues/jobs/send-notification-job';
import { GetUserByAuthorIdUseCase } from '../use-cases/queries/get-user-by-author-id';

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private projectsRepository: ProjectsRepository,
    @InjectQueue('notifications') private notificationQueue: Queue,
    private readonly getUserByAuthorIdUseCase: GetUserByAuthorIdUseCase,
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
      const IsProjectOwnerCreatedAnswer = project.authorId === answer.authorId;

      if (IsProjectOwnerCreatedAnswer) {
        return;
      }

      const authorOrError = await this.getUserByAuthorIdUseCase.execute({
        authorId: answer.authorId,
      });

      if (authorOrError.value.isFailure) {
        //TODO: create log when this failure happens
        return;
      }

      const author = authorOrError.value.getValue();

      await this.notificationQueue.add(
        'answer-created',
        new SendNotificationJob({
          authorId: answer.authorId,
          authorAvatar: author.avatarUrl,
          recipientId: project.authorId,
          title: `New answer in **\"${project.name}\"** of **${author.name}**`,
          linkTo: `/projects/${project.authorId}/${project.slug.value}`,
          type: NotificationType.INTERACTION,
        }),
      );
    }
  }
}
