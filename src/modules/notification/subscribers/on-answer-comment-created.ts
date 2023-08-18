import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { AnswersRepository } from '@modules/timeline/application/repositories/answers-repository';
import { ProjectsRepository } from '@modules/timeline/application/repositories/projects-repository';
import { AnswerCommentCreatedEvent } from '@modules/timeline/domain/events/answer-comment-created';

import { SendNotificationUseCase } from '../application/use-cases/send-notification';

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private projectsRepository: ProjectsRepository,
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId,
    );

    if (answer) {
      const project = await this.projectsRepository.findById(answer.projectId);

      if (project) {
        await this.sendNotification.execute({
          recipientId: project.authorId,
          title: `Novo comentário em "${project.title}`,
          content: answerComment.excerpt,
        });
      }
    }
  }
}
