import { DomainEvents } from '@common/domain/events/domain-events';
import { EventHandler } from '@common/domain/events/event-handler';
import { UsersRepository } from '@modules/account/application/repositories/users-repository';
import { AnswersRepository } from '@modules/timeline/application/repositories/answers-repository';
import { AnswerCommentCreatedEvent } from '@modules/timeline/domain/events/answer-comment-created';

import { SendNotificationUseCase } from '../application/use-cases/send-notification';

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private userRepository: UsersRepository,
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
      const user = await this.userRepository.findById(answerComment.authorId);

      await this.sendNotification.execute({
        authorId: answerComment.authorId,
        recipientId: answer.authorId,
        title: `${user?.name} comentou na sua resposta`,
        content: answerComment.excerpt,
      });
    }
  }
}
