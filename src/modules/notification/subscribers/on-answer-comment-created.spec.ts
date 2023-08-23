import { InMemoryUsersRepository } from '@modules/account/application/repositories/in-memory/in-memory-users-repository';
import { InMemoryAnswerCommentsRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-answers-repository';
import { InMemoryProjectsRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-roles-repository';

import { makeFakeAnswer } from '@test/factories/make-answer';
import { makeFakeAnswerComment } from '@test/factories/make-answer-comment';
import { makeFakeProject } from '@test/factories/make-project';
import { waitFor } from '@test/factories/utils/wait-for';

import { InMemoryNotificationsRepository } from '../application/repositories/in-memory/in-memory-notifications-repository';
import { SendNotificationUseCase } from '../application/use-cases/send-notification';
import { OnAnswerCommentCreated } from './on-answer-comment-created';

let notificationsRepository: InMemoryNotificationsRepository;
let rolesRepository: InMemoryRolesRepository;
let projectsRepository: InMemoryProjectsRepository;
let answersRepository: InMemoryAnswersRepository;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let usersRepository: InMemoryUsersRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: jest.SpyInstance;

describe('On Answer comment created', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();

    answersRepository = new InMemoryAnswersRepository();
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    usersRepository = new InMemoryUsersRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    );

    sendNotificationExecuteSpy = jest.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCommentCreated(
      answersRepository,
      usersRepository,
      sendNotificationUseCase,
    );
  });

  it('should send a notification when an answer comment is created', async () => {
    const project = makeFakeProject();
    const answer = makeFakeAnswer({ projectId: project.id });

    await projectsRepository.create(project);
    await answersRepository.create(answer);

    expect(projectsRepository.items).toHaveLength(1);
    expect(answersRepository.items).toHaveLength(1);

    const answerComment = makeFakeAnswerComment({
      answerId: answer.id,
    });

    await answerCommentsRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
