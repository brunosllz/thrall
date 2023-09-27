import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { UsersRepository } from '@modules/account/application/repositories/users-repository';
import { AnswersRepository } from '@modules/project-management/application/repositories/answers-repository';
import { AnswerCommentCreatedEvent } from '@modules/project-management/domain/events/answer-comment-created';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { SendNotificationJob } from '../queues/jobs/send-notification-job';

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private userRepository: UsersRepository,
    @InjectQueue('notifications') private notificationQueue: Queue,
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
      const user = await this.userRepository.findById(answerComment.authorId);

      // await this.notificationQueue.add(
      //   'answer-comment-created',
      //   new SendNotificationJob({
      //     authorId: answerComment.authorId,
      //     recipientId: answer.authorId,
      //     title: `${user?.name} comentou na sua resposta`,
      //     content: answerComment.excerpt,
      //   }),
      // );
    }
  }
}
